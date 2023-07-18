import { Module } from '@nestjs/common';
import { DocumentFileController } from './documentFile.controller';
import { DocumentFileService } from './documentFile.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { DocumentFile } from './documentFile.model';

@Module({
  controllers: [DocumentFileController],
  providers: [DocumentFileService],
  imports: [SequelizeModule.forFeature([DocumentFile])],
})
export class DocumentFileModule {}
