import { ApiProperty } from '@nestjs/swagger';
import { PlayerBet } from '../../common/types';

export class RoundBetsDto {
  @ApiProperty({
    type: 'object',
    additionalProperties: {
      type: 'object', // assuming PlayerBet is an object
      properties: {
        bet: { type: 'number' },
        cashOutMultiplier: { type: 'number' },
      },
    },
  })
  roundBets: { [playerId: string]: PlayerBet };
}
