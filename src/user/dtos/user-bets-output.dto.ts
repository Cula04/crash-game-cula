import { ApiProperty } from '@nestjs/swagger';
import { RoundBet } from 'src/common/types';

export class UserBetsOutputDto implements RoundBet {
  @ApiProperty({
    type: Number,
    description: 'The id of the round bet',
  })
  roundId: number;

  @ApiProperty({
    type: String,
    description: 'The id of the player',
  })
  playerId: string;

  @ApiProperty({
    type: Number,
    description: 'The bet of the player',
  })
  bet: number;

  @ApiProperty({
    type: Number,
    description: 'The cash out multiplier of the player',
  })
  cashOutMultiplier: number;
}
