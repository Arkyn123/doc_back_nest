import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DocumentRouteController } from './documentRoute.controller';
import { DocumentRouteService } from './documentRoute.service';
import { DocumentRoute } from './documentRoute.model';

@Module({
  controllers: [DocumentRouteController],
  providers: [DocumentRouteService],
  imports: [SequelizeModule.forFeature([DocumentRoute])],
})
export class DocumentRouteModule {}
