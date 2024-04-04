import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PlayerBet, RoundInfo, RoundPhase } from '../../common/types';
import { RoundsRepository } from '../crash-round.repository';
import { RoundBetEntity } from '../entities';
import { RoundEntity } from '../entities/round.entity';

// Duration of each phase in milliseconds
const ACCEPTING_BETS_DURATION = 10_000;
const PREPARING_DURATION = 2_000;
const CRASH_DURATION = 1_000;

@Injectable()
export class CrashRoundService implements OnApplicationBootstrap {
  #roundId: number;
  #currentPhase: RoundPhase; // Current phase of the round
  #multiplier: number; // Current multiplier
  #maxMultiplier: number;
  #gameInterval: NodeJS.Timeout | null; // Interval for game loop
  #roundBets: { [key: string]: PlayerBet }; // Object to store players and their bets
  #phaseStartingTime: number;

  // Rounds history to export to DB
  #roundBetsList: RoundBetEntity[] = [];
  #roundsList: RoundEntity[] = [];

  constructor(
    private readonly configService: ConfigService,
    private readonly roundsRepository: RoundsRepository,
  ) {
    this.#roundId = 0;
    this.#currentPhase = RoundPhase.CRASH;
  }

  get roundInfo(): RoundInfo {
    return {
      roundId: this.#roundId,
      roundPhase: this.#currentPhase,
      currentMultiplier: this.#multiplier,
      roundBets: this.#roundBets,
    };
  }

  async onApplicationBootstrap() {
    this.#startGameLoop();
  }

  // Function to start the game loop
  async #startGameLoop(): Promise<void> {
    this.#roundId = await this.roundsRepository.getLatestRoundId();
    this.#startRound();
  }

  // Function to start a new round
  #startRound(): void {
    this.#roundId++;
    this.#currentPhase = RoundPhase.ACCEPTING_BETS;
    this.#phaseStartingTime = Date.now();
    this.#maxMultiplier = this.#getMaxMultiplier();
    this.#roundBets = {};

    // Add round to list
    this.#addRound();

    // Set interval for round phases
    this.#gameInterval = setInterval(
      () => this.#resolvePhase(),
      parseInt(this.configService.get('GAME_PROCESSING_INTERVAL')) || 10,
    );
  }

  // Function to resolve the current phase
  #resolvePhase(): void {
    switch (this.#currentPhase) {
      // --------------------------------------------
      case RoundPhase.ACCEPTING_BETS:
        if (this.#currentPhaseTime() >= ACCEPTING_BETS_DURATION) {
          this.#currentPhase = RoundPhase.PREPARING;
          this.#phaseStartingTime = Date.now();
        }
        break;
      // --------------------------------------------
      case RoundPhase.PREPARING:
        if (this.#currentPhaseTime() >= PREPARING_DURATION) {
          this.#currentPhase = RoundPhase.FLYING;
          this.#phaseStartingTime = Date.now();
        }
        break;
      // --------------------------------------------
      case RoundPhase.FLYING:
        this.#multiplier = this.#getCurrentMultiplier(
          this.#currentPhaseTime() / 1000,
        );

        if (this.#multiplier >= this.#maxMultiplier) {
          this.#currentPhase = RoundPhase.CRASH;
          this.#phaseStartingTime = Date.now();
        }
        break;
      // --------------------------------------------
      case RoundPhase.CRASH:
        if (this.#currentPhaseTime() >= CRASH_DURATION) {
          clearInterval(this.#gameInterval);
          this.#addRoundBets();
          this.#startRound();
        }
        break;
      // --------------------------------------------
    }
  }

  // Function for a player to place a bet
  placeBet(playerId: string, roundId: number, bet: number): string | void {
    if (roundId !== this.#roundId)
      return 'Cannot place bet for a round that has not started yet!';

    if (this.#currentPhase !== RoundPhase.ACCEPTING_BETS)
      return `Cannot place bet out of ${RoundPhase.ACCEPTING_BETS} phase`;

    if (playerId in this.#roundBets)
      return 'Player already placed a bet in this round!';

    this.#roundBets[playerId] = {
      bet: bet,
      cashOutMultiplier: 0, // Placeholder value until cash out
    };
  }

  // Function for a player to cash out
  cashOut(playerId: string, roundId: number): string | void {
    if (this.#currentPhase !== RoundPhase.FLYING)
      return 'Wait for the round to start to cash out!';

    if (!(playerId in this.#roundBets) || roundId !== this.#roundId)
      return 'Player has not placed a bet in this round!';

    if (this.#roundBets[playerId].cashOutMultiplier !== 0)
      return 'Player already cashed out in this round!';

    this.#roundBets[playerId].cashOutMultiplier = this.#multiplier;
  }

  // Add round to list
  #addRound(): void {
    this.#roundsList.push(
      RoundEntity.create({
        roundId: this.#roundId,
        startTime: this.#phaseStartingTime,
        maxMultiplier: this.#maxMultiplier,
      }),
    );
  }

  // Add round bets to list
  #addRoundBets(): void {
    Object.keys(this.#roundBets).forEach((playerId) => {
      this.#roundBetsList.push(
        RoundBetEntity.create({
          roundId: this.#roundId,
          playerId: playerId,
          bet: this.#roundBets[playerId].bet,
          cashOutMultiplier: this.#roundBets[playerId].cashOutMultiplier,
        }),
      );
    });
  }

  // Function to get rounds and clear them if needed
  getRoundsData(clearRounds = false): {
    rounds: RoundEntity[];
    roundBets: RoundBetEntity[];
  } {
    const returnedRounds = this.#roundsList.filter(
      (round) => round.roundId < this.#roundId,
    );
    const returnedRoundBets = this.#roundBetsList.filter(
      (roundBet) => roundBet.roundId < this.#roundId,
    );

    if (clearRounds) {
      this.#roundBetsList = this.#roundBetsList.filter(
        (roundBet) => roundBet.roundId >= this.#roundId,
      );
      this.#roundsList = this.#roundsList.filter(
        (round) => round.roundId >= this.#roundId,
      );
    }

    return { rounds: returnedRounds, roundBets: returnedRoundBets };
  }

  // Function to get current phase time
  #currentPhaseTime(): number {
    return Date.now() - this.#phaseStartingTime;
  }

  // Function to calculate the maximum multiplier for the round's running phase
  #getMaxMultiplier(): number {
    return Math.floor(Math.random() * 1_000) / 100 + 1;
  }

  // Function to calculate the current multiplier for the round's running phase
  #getCurrentMultiplier(gameDurationInSec: number): number {
    return (
      1 +
      0.05 * gameDurationInSec +
      0.005 * Math.pow(gameDurationInSec, 2) +
      0.00000000001 * Math.pow(gameDurationInSec, 7.2)
    );
  }
}
