import { IsNumber, IsString } from 'class-validator';

export class PlaceBetDto {
  @IsString()
  playerId: string;

  @IsNumber()
  roundId: number;

  @IsString()
  playerName: string;

  @IsNumber()
  amount: number;
}
