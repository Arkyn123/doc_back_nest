import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { FindMssqlService } from './find-mssql.service';

@Controller('findMSSQL')
export class FindMssqlController {
  constructor(private readonly findMssqlService: FindMssqlService) {}

  @Get('schedule')
  getAllSchedule(@Query() query, @Res() res) {
    return this.findMssqlService.getAllSchedule(query, res);
  }

  @Get('brigada')
  getAllBrigada(@Query() query, @Res() res) {
    return this.findMssqlService.getAllBrigada(query, res);
  }

  @Get('brigades')
  getAllBrigades(@Query() query, @Res() res) {
    return this.findMssqlService.getAllBrigades(query, res);
  }
}
