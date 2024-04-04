import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RoundBet, UserInfo } from 'src/common/types';
import { CrashRoundEventsService } from 'src/crash-round/services/crash-round-events.service';
import { v4 as uuid } from 'uuid';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserEntity } from './entities';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly crashRoundEventsService: CrashRoundEventsService,
  ) {}

  async createUser(user: CreateUserDto): Promise<UserInfo> {
    const encryptedPassword = await bcrypt.hash(user.password, 10);
    const userEntity = UserEntity.create({
      _id: uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...user,
      password: encryptedPassword,
    });
    await this.userRepository.createUser(userEntity);
    return userEntity.userInfo;
  }

  async getUserInfo(id: string): Promise<UserInfo> {
    const userEntity = await this.userRepository.getUserById(id);
    return userEntity.userInfo;
  }

  async getUserBets(id: string): Promise<RoundBet[]> {
    const bets = await this.crashRoundEventsService.getPlayerBetHistory(id);
    return bets;
  }
}
