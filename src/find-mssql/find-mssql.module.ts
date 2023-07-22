import { Module } from '@nestjs/common';
import { FindMssqlController } from './find-mssql.controller';
import { FindMssqlService } from './find-mssql.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { T_XXHR_SCHEDULE_BRIGADES } from './T_XXHR_SCHEDULE_BRIGADES.model';
import { T_XXHR_OSK_ORG_HIERARHY_V } from './T_XXHR_OSK_ORG_HIERARHY_V.model';
import { T_XXHR_OSK_POSITIONS } from './T_XXHR_OSK_POSITIONS.model';
import { T_XXHR_OSK_ASSIGNMENTS_V } from './T_XXHR_OSK_ASSIGNMENTS_V.model';
import { T_XXHR_WORK_SCHEDULES } from './T_XXHR_WORK_SCHEDULES.model';

@Module({
  controllers: [FindMssqlController],
  providers: [FindMssqlService],
  imports: [
    SequelizeModule.forFeature([
      T_XXHR_SCHEDULE_BRIGADES,
      T_XXHR_OSK_ORG_HIERARHY_V,
      T_XXHR_OSK_ASSIGNMENTS_V,
      T_XXHR_OSK_POSITIONS,
      T_XXHR_WORK_SCHEDULES,
    ]),
  ],
})
export class FindMssqlModule {}
