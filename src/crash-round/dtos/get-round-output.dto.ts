import { ApiProperty } from '@nestjs/swagger';
import { PlayerBet, Round } from '../../common/types';
import { RoundBetsDto } from './round-bets.dto';

export class GetRoundOutputDto implements Round {
  @ApiProperty({
    type: Number,
    description: 'The unique identifier of the round',
  })
  roundId: number;

  @ApiProperty({
    type: Number,
    description: 'The time the round started',
  })
  startTime: number;

  @ApiProperty({
    type: Number,
    description: 'The maximum multiplier of the round',
  })
  maxMultiplier: number;

  @ApiProperty({
    type: RoundBetsDto,
    description: 'Bets made by players in this round',
    required: false,
  })
  roundBets?: { [playerId: string]: PlayerBet };
}
