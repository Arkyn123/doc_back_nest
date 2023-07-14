import { Module } from '@nestjs/common';
import { DocumentRouteController } from './documentRoute.controller';
import { DocumentRouteService } from './documentRoute.service';

@Module({
  controllers: [DocumentRouteController],
  providers: [DocumentRouteService]
})
export class DocumentRouteModule {}
