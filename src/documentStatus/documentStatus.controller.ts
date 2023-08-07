import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { DocumentStatusService } from './documentStatus.service';
import { User } from 'src/utils/customDecorators';

@Controller('documentStatus')
export class DocumentStatusController {
  constructor(private readonly documentStatusService: DocumentStatusService) {}

  @Get()
  getAllStatuses(@Res() res) {
    return this.documentStatusService.getAllStatuses(res);
  }

  @Post('add')
  addNewStatus(@Body() body, @User() user, @Res() res) {
    return this.documentStatusService.addNewStatus(body, user, res);
  }
}
