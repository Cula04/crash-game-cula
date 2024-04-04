import { BaseEntity } from '../../common/base-classes/base.entity';
import { Round } from '../../common/types';

export class RoundEntity extends BaseEntity<Round> {
  private constructor(props: Round, id?: string) {
    super(props, id);
  }

  public static create(props: Round, id?: string): RoundEntity {
    const entity = new RoundEntity(props, id);
    return entity;
  }

  get id() {
    return this._id;
  }

  get roundId() {
    return this.props.roundId;
  }

  get startTime() {
    return this.props.startTime;
  }

  get maxMultiplier() {
    return this.props.maxMultiplier;
  }

  get roundBets() {
    return this.props.roundBets;
  }
}
