import { PlayerBet } from './player-bet.type';
import { RoundPhase } from './round-phase.enum';

export type Round = {
  roundId: number;
  startTime: number;
  maxMultiplier: number;
  roundBets?: { [playerId: string]: PlayerBet };
};

export type RoundInfo = Pick<Round, 'roundId' | 'roundBets'> & {
  roundPhase: RoundPhase;
  currentMultiplier: number;
};
