import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { UserDbEntity, UserEntity } from './entities';

@Injectable({})
export class UserRepository {
  constructor(
    @InjectRepository(UserDbEntity)
    private readonly usersTableRepo: MongoRepository<UserDbEntity>,
  ) {}

  async createUser(user: UserEntity): Promise<string> {
    const dbEntity = UserDbEntity.fromDomainEntity(user);
    await this.usersTableRepo.save(dbEntity);
    return user.id;
  }

  async getUserById(id: string): Promise<UserEntity> {
    const dbEntity = await this.usersTableRepo.findOne({ where: { _id: id } });
    if (!dbEntity) {
      throw new BadRequestException(`User with ID ${id} not found.`);
    }
    return dbEntity.toDomainEntity();
  }
}
