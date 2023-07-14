import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { Document } from './document.model';

@Module({
  controllers: [DocumentController],
  providers: [DocumentService],
  imports: [SequelizeModule.forFeature([Document])],
})
export class DocumentModule {}
