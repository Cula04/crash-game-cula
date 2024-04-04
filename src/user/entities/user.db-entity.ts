import { User } from 'src/common/types';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'users' })
export class UserDbEntity implements User {
  @ObjectIdColumn()
  _id: string;

  @Column()
  userName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  isVerified: boolean;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  toDomainEntity?() {
    return UserEntity.create(
      {
        _id: this._id,
        userName: this.userName,
        email: this.email,
        password: this.password,
        isVerified: this.isVerified,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
      },
      this._id,
    );
  }

  static fromDomainEntity(entity: UserEntity): UserDbEntity {
    return {
      _id: entity.id,
      userName: entity.userName,
      email: entity.email,
      password: entity.password,
      isVerified: entity.isVerified,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}

export const UserDBColumns: {
  [key in keyof UserDbEntity]: keyof UserDbEntity;
} = {
  _id: '_id',
  userName: 'userName',
  email: 'email',
  password: 'password',
  isVerified: 'isVerified',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

export const UserDBName = 'users';
