import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { PlayerBet } from '../../common/types';
import { RoundBetDbEntity } from './round-bet.db-entity';
import { RoundEntity } from './round.entity';

export const RoundDBName = 'rounds';

@Entity({ name: RoundDBName })
export class RoundDbEntity {
  @ObjectIdColumn()
  _id: string;

  @Column()
  roundId: number;

  @Column()
  startTime: number;

  @Column()
  maxMultiplier: number;

  @Column(() => RoundBetDbEntity)
  roundDbBets?: RoundBetDbEntity[];

  toDomainEntity?() {
    return RoundEntity.create(
      {
        roundId: this.roundId,
        startTime: this.startTime,
        maxMultiplier: this.maxMultiplier,
        roundBets: this.#extractRoundBets(),
      },
      this._id,
    );
  }

  #extractRoundBets?() {
    const roundBets: { [playerId: string]: PlayerBet } = {};
    this.roundDbBets?.forEach((bet) => {
      roundBets[bet.playerId] = {
        bet: bet.bet,
        cashOutMultiplier: bet.cashOutMultiplier,
      };
    });
    return roundBets;
  }

  static fromDomainEntity(entity: RoundEntity): RoundDbEntity {
    return {
      _id: entity.id,
      roundId: entity.roundId,
      startTime: entity.startTime,
      maxMultiplier: entity.maxMultiplier,
    };
  }

  static addRoundBets(entity: RoundDbEntity, roundDbBets: RoundBetDbEntity[]) {
    entity.roundDbBets = roundDbBets;
    return entity;
  }
}

export const RoundDBColumns: {
  [key in keyof RoundDbEntity]: keyof RoundDbEntity;
} = {
  _id: '_id',
  roundId: 'roundId',
  startTime: 'startTime',
  maxMultiplier: 'maxMultiplier',
  roundDbBets: 'roundDbBets',
};
