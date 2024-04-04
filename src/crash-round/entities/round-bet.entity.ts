import { BaseEntity } from '../../common/base-classes/base.entity';
import { RoundBet } from '../../common/types';

export class RoundBetEntity extends BaseEntity<RoundBet> {
  private constructor(props: RoundBet, id?: string) {
    super(props, id);
  }

  public static create(props: RoundBet, id?: string): RoundBetEntity {
    const entity = new RoundBetEntity(props, id);
    return entity;
  }

  get id() {
    return this._id;
  }

  get roundId() {
    return this.props.roundId;
  }

  get playerId() {
    return this.props.playerId;
  }

  get bet() {
    return this.props.bet;
  }

  get cashOutMultiplier() {
    return this.props.cashOutMultiplier;
  }
}
