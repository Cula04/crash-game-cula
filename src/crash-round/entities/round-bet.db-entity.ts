import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { RoundBet } from '../../common/types';
import { RoundBetEntity } from './round-bet.entity';

export const RoundBetDBName = 'round_bets';

@Entity({ name: RoundBetDBName })
export class RoundBetDbEntity implements RoundBet {
  @ObjectIdColumn()
  _id: string;

  @Column()
  roundId: number;

  @Column()
  playerId: string;

  @Column()
  bet: number;

  @Column()
  cashOutMultiplier: number;

  toDomainEntity?() {
    return RoundBetEntity.create(
      {
        roundId: this.roundId,
        playerId: this.playerId,
        bet: this.bet,
        cashOutMultiplier: this.cashOutMultiplier,
      },
      this._id,
    );
  }

  static fromDomainEntity(entity: RoundBetEntity): RoundBetDbEntity {
    return {
      _id: entity.id,
      roundId: entity.roundId,
      playerId: entity.playerId,
      bet: entity.bet,
      cashOutMultiplier: entity.cashOutMultiplier,
    };
  }
}

export const RoundBetDBColumns: {
  [key in keyof RoundBetDbEntity]: keyof RoundBetDbEntity;
} = {
  _id: '_id',
  roundId: 'roundId',
  playerId: 'playerId',
  bet: 'bet',
  cashOutMultiplier: 'cashOutMultiplier',
};
