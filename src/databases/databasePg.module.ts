import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { config } from 'src/utils/config';
import { Document } from 'src/document/document.model';
import { DocumentStatus } from 'src/documentStatus/documentStatus.model';
import { DocumentOrderLog } from 'src/documentOrderLog/documentOrderLog.model';
import { DocumentFile } from 'src/documentFile/documentFile.model';
import { DocumentRoute } from 'src/documentRoute/documentRoute.model';
import { DocumentType } from 'src/documentType/documentType.model';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: config[process.env.NODE_ENV].database.dialect,
      host: config[process.env.NODE_ENV].database.host,
      port: +config[process.env.NODE_ENV].database.port,
      username: config[process.env.NODE_ENV].database.username,
      password: config[process.env.NODE_ENV].database.password,
      database: config[process.env.NODE_ENV].database.database,
      autoLoadModels: true,
      synchronize: false,
      models: [
        Document,
        DocumentStatus,
        DocumentOrderLog,
        DocumentFile,
        DocumentType,
        DocumentRoute,
      ],
    }),
  ],
  controllers: [],
  providers: [],
})
export class databasePgModule {}
