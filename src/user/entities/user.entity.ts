import { BaseEntity } from 'src/common/base-classes/base.entity';
import { User, UserInfo } from 'src/common/types';

export class UserEntity extends BaseEntity<User> {
  private constructor(props: User, id?: string) {
    super(props, id);
  }

  public static create(props: User, id?: string): UserEntity {
    const entity = new UserEntity(props, id);
    return entity;
  }

  get id() {
    return this._id;
  }

  get userName() {
    return this.props.userName;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get isVerified() {
    return this.props.isVerified;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get userInfo(): UserInfo {
    return {
      _id: this.id,
      userName: this.props.userName,
      email: this.props.email,
      isVerified: this.props.isVerified,
    };
  }
}
