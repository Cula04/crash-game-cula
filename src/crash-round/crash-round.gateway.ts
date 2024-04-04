import {
  BadRequestException,
  Logger,
  UnauthorizedException,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { WsCatchAllFilter } from 'src/common/exceptions/ws-catch-all-filter';
import { CashOutDto, PlaceBetDto } from './dtos';
import { CrashRoundService } from './services/crash-round.service';

@UsePipes(new ValidationPipe())
@UseFilters(new WsCatchAllFilter())
@WebSocketGateway({ namespace: 'crash-round' })
export class CrashRoundGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(CrashRoundGateway.name);
  private readonly GAME_INFO_ROOM = 'game-info';
  private readonly SUBSCRIBE_EVENT = 'subscribed';
  private readonly SUBSCRIBE_FREQUENCY = 1000;

  private clientRooms: Map<string, Set<string>> = new Map();

  constructor(private readonly crashRoundService: CrashRoundService) {}

  @WebSocketServer() crashRoundNamespace: Namespace;

  afterInit(): void {
    this.logger.log('CrashRoundGateway initialized');
    setInterval(() => {
      const roundInfo = this.crashRoundService.roundInfo;
      this.crashRoundNamespace
        .to(this.GAME_INFO_ROOM)
        .emit(this.SUBSCRIBE_EVENT, {
          data: roundInfo,
        });
    }, this.SUBSCRIBE_FREQUENCY);
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    this.clientRooms.set(client.id, new Set());
  }
  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.clientRooms.delete(client.id);
  }

  @SubscribeMessage('subscribe')
  async subscribe(@ConnectedSocket() client: Socket) {
    const rooms = this.clientRooms.get(client.id);
    if (rooms) rooms.add(this.GAME_INFO_ROOM);

    await client.join(this.GAME_INFO_ROOM);
    client.emit(this.SUBSCRIBE_EVENT, {
      message: `You are subscribed to room ${this.GAME_INFO_ROOM}.`,
    });
  }

  @SubscribeMessage('unsubscribe')
  async unsubscribe(@ConnectedSocket() client: Socket) {
    this.#checkClientInRoom(client, this.GAME_INFO_ROOM);
    const rooms = this.clientRooms.get(client.id);
    if (rooms) rooms.delete(this.GAME_INFO_ROOM);

    await client.leave(this.GAME_INFO_ROOM);
    client.emit(this.SUBSCRIBE_EVENT, {
      message: `You unsubscribed from room ${this.GAME_INFO_ROOM}.`,
    });
  }

  @SubscribeMessage('bet')
  async placeBet(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: PlaceBetDto,
  ) {
    this.#checkClientInRoom(client, this.GAME_INFO_ROOM);
    const { playerId, playerName, amount, roundId } = data;

    const error = this.crashRoundService.placeBet(playerId, roundId, amount);
    if (error) throw new BadRequestException(error);

    this.crashRoundNamespace
      .to(this.GAME_INFO_ROOM)
      .emit(this.SUBSCRIBE_EVENT, {
        message: `Player ${playerName} placed a bet of ${amount}.`,
      });
  }

  @SubscribeMessage('cash-out')
  async cashOut(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: CashOutDto,
  ) {
    this.#checkClientInRoom(client, this.GAME_INFO_ROOM);

    const error = this.crashRoundService.cashOut(data.playerId, data.roundId);
    if (error) throw new BadRequestException(error);

    const playerBet = this.crashRoundService.roundInfo.roundBets[data.playerId];
    this.crashRoundNamespace
      .to(this.GAME_INFO_ROOM)
      .emit(this.SUBSCRIBE_EVENT, {
        message: `Player ${data.playerName} cashed out at ${playerBet.cashOutMultiplier} and won ${playerBet.bet * playerBet.cashOutMultiplier}.`,
      });
  }

  #checkClientInRoom(client: Socket, room: string): void {
    const rooms = this.clientRooms.get(client.id);
    const clientInRoom = rooms?.has(room);
    if (!clientInRoom)
      throw new UnauthorizedException(
        'You are not subscribed to the game info room',
      );
  }
}
