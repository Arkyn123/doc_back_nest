import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { DocumentStatusController } from './documentStatus.controller';
import { DocumentStatusService } from './documentStatus.service';
import { DocumentStatus } from './documentStatus.model';

@Module({
  controllers: [DocumentStatusController],
  providers: [DocumentStatusService],
  imports: [SequelizeModule.forFeature([DocumentStatus])],
})
export class DocumentStatusModule {}
