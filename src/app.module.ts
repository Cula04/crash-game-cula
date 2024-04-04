import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrashRoundModule } from './crash-round/crash-round.module';
import { RoundBetDbEntity } from './crash-round/entities';
import { RoundDbEntity } from './crash-round/entities/round.db-entity';
import { UserDbEntity } from './user/entities';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: `${process.env.MONGO_DB_URL}`,
      entities: [RoundDbEntity, RoundBetDbEntity, UserDbEntity],
      synchronize: true, // Set this to false in production and use migrations
    }),
    CrashRoundModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
