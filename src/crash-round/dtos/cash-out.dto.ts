import { IsNumber, IsString } from 'class-validator';

export class CashOutDto {
  @IsString()
  playerId: string;

  @IsNumber()
  roundId: number;

  @IsString()
  playerName: string;
}
