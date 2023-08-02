import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { ReportService } from './report.service';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post('brigada')
  getAllBrigada(@Body() body, @Res() res) {
    return this.reportService.getAllDocumentsInfo(body, res);
  }
}
