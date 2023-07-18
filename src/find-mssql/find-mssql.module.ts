import { Module } from '@nestjs/common';
import { FindMssqlController } from './find-mssql.controller';
import { FindMssqlService } from './find-mssql.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { T_XXHR_SCHEDULE_BRIGADES } from './T_XXHR_SCHEDULE_BRIGADES.model';

@Module({
  controllers: [FindMssqlController],
  providers: [FindMssqlService],
  imports: [SequelizeModule.forFeature([T_XXHR_SCHEDULE_BRIGADES])],
})
export class FindMssqlModule {}
