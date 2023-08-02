import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import {
  setPermissionsPaths,
  setPermissionsPathsPlusSequelizeFiltering,
} from './utils/paths';

import { UserModule } from './user/user.module';
import { DocumentModule } from './document/document.module';
import { ReportModule } from './report/report.module';
import { DocumentFileModule } from './documentFile/documentFile.module';
import { DocumentTypeModule } from './documentType/documentType.module';
import { DocumentStatusModule } from './documentStatus/documentStatus.module';
import { DocumentRouteModule } from './documentRoute/documentRoute.module';

import { FindMssqlModule } from './find-mssql/find-mssql.module';
import { DicOfficeModule } from './dicOffice/dicOffice.module';
import { DicOfficeCorrespondenceModule } from './dicOfficeCorrespondence/dicOfficeCorrespondence.module';

import { setPermissions } from './middleware/SetPermissions';
import { SequelizeFiltering } from './middleware/SequelizeFilteringMiddleware';
import { databasePgModule } from './databases/databasePG.module';
import { databaseMssqlModule } from './databases/databaseMssql.module';
import { DocumentOrderLogModule } from './documentOrderLog/documentOrderLog.module';

@Module({
  imports: [
    // databaseMssqlModule,
    FindMssqlModule,
    databasePgModule,
    UserModule,
    DocumentModule,
    ReportModule,
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
