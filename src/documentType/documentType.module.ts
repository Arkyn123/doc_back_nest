import { Module } from '@nestjs/common';
import { DocumentTypeController } from './documentType.controller';
import { DocumentTypeService } from './documentType.service';

@Module({
  controllers: [DocumentTypeController],
  providers: [DocumentTypeService]
})
export class DocumentTypeModule {}
