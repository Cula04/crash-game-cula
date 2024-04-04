import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RoundsRepository } from '../crash-round.repository';
import { RoundBetEntity } from '../entities/round-bet.entity';
import { RoundEntity } from '../entities/round.entity';
import { CrashRoundService } from './crash-round.service';

@Injectable()
export class CrashRoundEventsService implements OnApplicationBootstrap {
  constructor(
    private readonly configService: ConfigService,
    private readonly crashRoundService: CrashRoundService,
    private readonly roundsRepository: RoundsRepository,
  ) {}

  onApplicationBootstrap() {
    this.#processRounds();
  }

  #processRounds() {
    setInterval(
      () => {
        const { rounds, roundBets } =
          this.crashRoundService.getRoundsData(true);
        this.saveRounds(rounds);
        this.saveRoundBets(roundBets);
      },
      parseInt(this.configService.get('SUBSCRIPTION_INTERVAL')) || 100,
    );
  }

  // Save rounds to the rounds database
  async saveRounds(rounds: RoundEntity[]): Promise<void> {
    if (rounds.length > 0) await this.roundsRepository.addRounds(rounds);
  }

  // Save user bets to the user bets database
  async saveRoundBets(roundBets: RoundBetEntity[]): Promise<void> {
    if (roundBets.length > 0)
      await this.roundsRepository.addRoundBets(roundBets);
  }

  // Get Round history
  async getRoundHistory(roundId: number): Promise<RoundEntity> {
    return this.roundsRepository.getRound(roundId);
  }

  // Get User bet history
  async getPlayerBetHistory(playerId: string): Promise<RoundBetEntity[]> {
    return this.roundsRepository.getPlayerBets(playerId);
  }
}
