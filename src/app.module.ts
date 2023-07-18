import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  setPermissionsPaths,
  setPermissionsPathsPlusSequelizeFiltering,
} from './utils/paths';

import { UserModule } from './user/user.module';

import { DocumentModule } from './document/document.module';
import { Document } from './document/document.model';

import { DocumentStatus } from './documentStatus/documentStatus.model';

import { DocumentOrderLog } from './documentOrderLog/documentOrderLog.model';

import { ReportModule } from './report/report.module';

import { FindMssqlModule } from './find-mssql/find-mssql.module';

import { DocumentFileModule } from './documentFile/documentFile.module';
import { DocumentFile } from './documentFile/documentFile.model';

import { DocumentTypeModule } from './documentType/documentType.module';
import { DocumentType } from './documentType/documentType.model';

import { DocumentStatusModule } from './documentStatus/documentStatus.module';

import { DocumentRouteModule } from './documentRoute/documentRoute.module';
import { DocumentRoute } from './documentRoute/documentRoute.model';

import { DicOfficeModule } from './dicOffice/dicOffice.module';
import { DicOffice } from './dicOffice/dicOffice.model';

import { DicOfficeCorrespondenceModule } from './dicOfficeCorrespondence/dicOfficeCorrespondence.module';
import { DicOfficeCorrespondence } from './dicOfficeCorrespondence/dicOfficeCorrespondence.model';

import { T_XXHR_SCHEDULE_BRIGADES } from './find-mssql/T_XXHR_SCHEDULE_BRIGADES.model';

import { CheckConnectionWithDB } from './middleware/CheckConnectionWithDbMiddleware';
import { setPermissions } from './middleware/SetPermissions';
import { SequelizeFiltering } from './middleware/SequelizeFilteringMiddleware';
import { config } from './utils/config';
import { databasePgModule } from './databases/databasePG.module';
import { databaseMssqlModule } from './databases/databaseMssql.module';
import { DocumentOrderLogModule } from './documentOrderLog/documentOrderLog.module';

@Module({
  imports: [
    databaseMssqlModule,
    databasePgModule,
    UserModule,
    DocumentModule,
    ReportModule,
    FindMssqlModule,
    DocumentFileModule,
    DocumentOrderLogModule,
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
    consumer.apply(setPermissions).forRoutes(...setPermissionsPaths);
    consumer
      .apply(setPermissions, SequelizeFiltering)
      .forRoutes(...setPermissionsPathsPlusSequelizeFiltering);
  }
}
