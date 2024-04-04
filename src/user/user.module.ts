import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrashRoundModule } from 'src/crash-round/crash-round.module';
import { UserDbEntity } from './entities';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([UserDbEntity]),
    CrashRoundModule,
  ],
  providers: [UserService, UserRepository, UserDbEntity],
  controllers: [UserController],
  exports: [UserDbEntity],
})
export class UserModule {}
