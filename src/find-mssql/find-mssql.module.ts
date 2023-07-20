import { Module } from '@nestjs/common';
import { FindMssqlController } from './find-mssql.controller';
import { FindMssqlService } from './find-mssql.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { T_XXHR_SCHEDULE_BRIGADES_V } from './T_XXHR_SCHEDULE_BRIGADES_V.model';
import { T_XXHR_OSK_ORG_HIERARHY_V } from './T_XXHR_OSK_ORG_HIERARHY_V.model';

@Module({
  controllers: [FindMssqlController],
  providers: [FindMssqlService],
  imports: [
    SequelizeModule.forFeature([
      T_XXHR_SCHEDULE_BRIGADES_V,
      T_XXHR_OSK_ORG_HIERARHY_V,
    ]),
  ],
})
export class FindMssqlModule {}
