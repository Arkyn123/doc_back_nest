import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { UserModule } from './user/user.module';

import { DocumentModule } from './document/document.module';
import { Document } from './document/document.model';

import { DocumentStatus } from './documentStatus/documentStatus.model';

import { DocumentOrderLog } from './documentOrderLog/DocumentOrderLog.model';

import { ReportModule } from './report/report.module';

import { FindMssqlModule } from './find-mssql/find-mssql.module';

import { FileModule } from './file/file.module';
import { File } from './file/file.model';

import { DocumentTypeModule } from './documentType/documentType.module';
import { DocumentType } from './documentType/documentType.model';

import { DocumentStatusModule } from './documentStatus/documentStatus.module';

import { DocumentRouteModule } from './documentRoute/documentRoute.module';
import { DocumentRoute } from './documentRoute/documentRoute.model';

import { DicOfficeModule } from './dicOffice/dicOffice.module';
import { DicOffice } from './dicOffice/dicOffice.model';

import { DicOfficeCorrespondenceModule } from './dicOfficeCorrespondence/dicOfficeCorrespondence.module';
import { DicOfficeCorrespondence } from './dicOfficeCorrespondence/dicOfficeCorrespondence.model';

import { T_XXHR_SCHEDULE_BRIGADES } from './T_XXHR_SCHEDULE_BRIGADES/T_XXHR_SCHEDULE_BRIGADES.model';

import { CheckConnectionWithDB } from './middleware/CheckConnectionWithDbMiddleware';
import { setPermissions } from './middleware/SetPermissions';
import { SequelizeFiltering } from './middleware/SequelizeFilteringMiddleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRESS_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRESS_PASSWORD,
      database: process.env.POSTGRES_DB,
      autoLoadModels: true,
      models: [
        Document,
        DocumentStatus,
        DocumentOrderLog,
        File,
        DocumentType,
        DocumentRoute,
        DicOffice,
        DicOfficeCorrespondence,
        T_XXHR_SCHEDULE_BRIGADES,
      ],
    }),
    UserModule,
    DocumentModule,
    ReportModule,
    FindMssqlModule,
    FileModule,
    DocumentTypeModule,
    DocumentStatusModule,
    DocumentRouteModule,
    DicOfficeModule,
    DicOfficeCorrespondenceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(setPermissions)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
    consumer
      .apply(setPermissions, SequelizeFiltering)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
