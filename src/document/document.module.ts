import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { Document } from './document.model';
import { DocumentRouteModule } from 'src/documentRoute/documentRoute.module';
import { DocumentRoute } from 'src/documentRoute/documentRoute.model';

@Module({
  controllers: [DocumentController],
  providers: [DocumentService],
  imports: [SequelizeModule.forFeature([Document, DocumentRoute])],
})
export class DocumentModule {}
