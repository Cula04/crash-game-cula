import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrashRoundController } from './crash-round.controller';
import { CrashRoundGateway } from './crash-round.gateway';
import { RoundsRepository } from './crash-round.repository';
import { RoundBetDbEntity } from './entities';
import { RoundDbEntity } from './entities/round.db-entity';
import { CrashRoundEventsService } from './services/crash-round-events.service';
import { CrashRoundService } from './services/crash-round.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([RoundBetDbEntity, RoundDbEntity]),
  ],
  providers: [
    CrashRoundService,
    CrashRoundEventsService,
    RoundsRepository,
    RoundBetDbEntity,
    RoundDbEntity,
    CrashRoundGateway,
  ],
  controllers: [CrashRoundController],
  exports: [RoundBetDbEntity, RoundDbEntity, CrashRoundEventsService],
})
export class CrashRoundModule {}
