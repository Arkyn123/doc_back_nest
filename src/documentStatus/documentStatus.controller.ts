import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { DocumentStatusService } from './documentStatus.service';

@Controller('documentStatus')
export class DocumentStatusController {
  constructor(private readonly documentStatusService: DocumentStatusService) {}

  @Get()
  getAllStatuses(@Req() req, @Res() res) {
    return this.documentStatusService.getAllStatuses(req, res);
  }

  @Post('add')
  addNewStatus(@Req() req, @Res() res) {
    return this.documentStatusService.addNewStatus(req, res);
  }
}
