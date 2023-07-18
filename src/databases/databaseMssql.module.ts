import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DicOffice } from 'src/dicOffice/dicOffice.model';
import { DicOfficeCorrespondence } from 'src/dicOfficeCorrespondence/dicOfficeCorrespondence.model';
import { T_XXHR_SCHEDULE_BRIGADES } from 'src/find-mssql/T_XXHR_SCHEDULE_BRIGADES.model';
import { config } from 'src/utils/config';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: config[process.env.NODE_ENV].databaseMSSQL.dialect,
      host: config[process.env.NODE_ENV].databaseMSSQL.host,
      port: +config[process.env.NODE_ENV].databaseMSSQL.port,
      username: config[process.env.NODE_ENV].databaseMSSQL.username,
      password: config[process.env.NODE_ENV].databaseMSSQL.password,
      database: config[process.env.NODE_ENV].databaseMSSQL.database,
      autoLoadModels: true,
      synchronize: false,
      models: [DicOffice, DicOfficeCorrespondence, T_XXHR_SCHEDULE_BRIGADES],
    }),
  ],
  controllers: [],
  providers: [],
})
export class databaseMssqlModule {}
