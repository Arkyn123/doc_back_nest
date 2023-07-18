import { Controller, Get, Req, Res } from '@nestjs/common';
import { FindMssqlService } from './find-mssql.service';

@Controller('findMSSQL')
export class FindMssqlController {
  constructor(private readonly findMssqlService: FindMssqlService) {}

  @Get('schedule')
  getAllSchedule(@Req() req, @Res() res) {
    return this.findMssqlService.getAllSchedule(req, res);
  }

  @Get('brigada')
  getAllBrigada(@Req() req, @Res() res) {
    return this.findMssqlService.getAllBrigada(req, res);
  }

  @Get('brigades')
  getAllBrigades(@Req() req, @Res() res) {
    return this.findMssqlService.getAllBrigades(req, res);
  }
}
