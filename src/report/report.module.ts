import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Document } from 'src/document/document.model';

@Module({
  controllers: [ReportController],
  providers: [ReportService],
  imports: [SequelizeModule.forFeature([Document])],
})
export class ReportModule {}
