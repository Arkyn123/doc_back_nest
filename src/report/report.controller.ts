import { Controller, Post, Req, Res } from '@nestjs/common';
import { ReportService } from './report.service';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post('brigada')
  getAllBrigada(@Req() req, @Res() res) {
    return this.reportService.getAllDocumentsInfo(req, res);
  }
}
