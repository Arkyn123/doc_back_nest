import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DicOffice } from 'src/dicOffice/dicOffice.model';
import { DicOfficeCorrespondence } from 'src/dicOfficeCorrespondence/dicOfficeCorrespondence.model';
import { T_XXHR_SCHEDULE_BRIGADES } from '../find-mssql/T_XXHR_SCHEDULE_BRIGADES.model';
import { T_XXHR_OSK_ORG_HIERARHY_V } from '../find-mssql/T_XXHR_OSK_ORG_HIERARHY_V.model';
import { T_XXHR_OSK_ASSIGNMENTS_V } from '../find-mssql/T_XXHR_OSK_ASSIGNMENTS_V.model';
import { config } from 'src/utils/config';
import { T_XXHR_OSK_POSITIONS } from 'src/find-mssql/T_XXHR_OSK_POSITIONS.model';
import { T_XXHR_WORK_SCHEDULES } from 'src/find-mssql/T_XXHR_WORK_SCHEDULES.model';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: config[process.env.NODE_ENV].databaseMSSQL.dialect,
      dialectOptions: {
        options: {
          encrypt: false,
        },
      },
      host: config[process.env.NODE_ENV].databaseMSSQL.host,
      port: +config[process.env.NODE_ENV].databaseMSSQL.port,
      username: config[process.env.NODE_ENV].databaseMSSQL.username,
      password: config[process.env.NODE_ENV].databaseMSSQL.password,
      database: config[process.env.NODE_ENV].databaseMSSQL.database,
      autoLoadModels: true,
      synchronize: false,
      models: [
        DicOffice,
        DicOfficeCorrespondence,
        T_XXHR_SCHEDULE_BRIGADES,
        T_XXHR_OSK_ORG_HIERARHY_V,
        T_XXHR_OSK_ASSIGNMENTS_V,
        T_XXHR_OSK_POSITIONS,
        T_XXHR_WORK_SCHEDULES,
      ],
    }),
  ],
  controllers: [],
  providers: [],
})
export class databaseMssqlModule {}
