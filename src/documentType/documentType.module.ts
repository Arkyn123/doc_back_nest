import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { DocumentTypeController } from './documentType.controller';
import { DocumentTypeService } from './documentType.service';
import { DocumentType } from './documentType.model';

@Module({
  controllers: [DocumentTypeController],
  providers: [DocumentTypeService],
  imports: [SequelizeModule.forFeature([DocumentType])],
})
export class DocumentTypeModule {}
