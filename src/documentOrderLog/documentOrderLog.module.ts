import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DocumentOrderLog } from './DocumentOrderLog.model';

@Module({
  controllers: [],
  providers: [],
  imports: [SequelizeModule.forFeature([DocumentOrderLog])],
})
export class DocumentOrderLogModule {}
