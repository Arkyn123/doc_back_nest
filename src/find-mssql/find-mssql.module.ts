import { Module } from '@nestjs/common';
import { FindMssqlController } from './find-mssql.controller';
import { FindMssqlService } from './find-mssql.service';

@Module({
  controllers: [FindMssqlController],
  providers: [FindMssqlService]
})
export class FindMssqlModule {}
