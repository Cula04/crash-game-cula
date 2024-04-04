import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import {
  RoundBetDBColumns,
  RoundBetDBName,
  RoundBetDbEntity,
  RoundBetEntity,
} from './entities';
import { RoundDBColumns, RoundDbEntity } from './entities/round.db-entity';
import { RoundEntity } from './entities/round.entity';

@Injectable({})
export class RoundsRepository {
  constructor(
    @InjectRepository(RoundDbEntity)
    private readonly roundsTableRepo: MongoRepository<RoundDbEntity>,
    @InjectRepository(RoundBetDbEntity)
    private readonly roundBetsTableRepo: MongoRepository<RoundBetDbEntity>,
  ) {}

  async addRoundBets(bets: RoundBetEntity[]): Promise<RoundBetEntity[]> {
    const dbEntities = bets.map((bet) =>
      RoundBetDbEntity.fromDomainEntity(bet),
    );
    await this.roundBetsTableRepo.save(dbEntities);
    return bets;
  }

  async getLatestRoundId(): Promise<number> {
    const lastRound = await this.roundsTableRepo.findOne({
      order: { roundId: 'DESC' },
    });
    return lastRound ? lastRound.roundId : 0;
  }

  async addRounds(rounds: RoundEntity[]): Promise<RoundEntity[]> {
    const dbEntities = rounds.map((round) =>
      RoundDbEntity.fromDomainEntity(round),
    );
    await this.roundsTableRepo.save(dbEntities);
    return rounds;
  }

  async getRound(roundId: number): Promise<RoundEntity> {
    const results = await this.roundsTableRepo
      .aggregateEntity([
        {
          $match: { roundId },
        },
        {
          $lookup: {
            from: RoundBetDBName,
            localField: RoundDBColumns.roundId,
            foreignField: RoundBetDBColumns.roundId,
            as: RoundDBColumns.roundDbBets,
          },
        },
      ])
      .toArray();

    if (results.length === 0) {
      throw new InternalServerErrorException(
        `Round with ID ${roundId} not found.`,
      );
    }

    return results[0].toDomainEntity();
  }

  async getRounds(): Promise<RoundEntity[]> {
    const results = await this.roundsTableRepo
      .aggregateEntity([
        {
          $lookup: {
            from: RoundBetDBName,
            localField: RoundDBColumns.roundId,
            foreignField: RoundBetDBColumns.roundId,
            as: RoundDBColumns.roundDbBets,
          },
        },
      ])
      .toArray();

    return results.map((dbRecord) => dbRecord.toDomainEntity());
  }

  async getPlayerBets(playerId: string): Promise<RoundBetEntity[]> {
    const dbEntities = await this.roundBetsTableRepo.find({
      where: { playerId },
    });
    return dbEntities.map((dbEntity) => dbEntity.toDomainEntity());
  }
}
