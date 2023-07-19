import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { Document } from './document.model';
import { DocumentRoute } from 'src/documentRoute/documentRoute.model';
import { DocumentType } from 'src/documentType/documentType.model';
import { DocumentOrderLog } from 'src/documentOrderLog/DocumentOrderLog.model';

@Module({
  controllers: [DocumentController],
  providers: [DocumentService],
  imports: [
    SequelizeModule.forFeature([
      Document,
      DocumentRoute,
      DocumentType,
      DocumentOrderLog,
    ]),
  ],
})
export class DocumentModule {}
