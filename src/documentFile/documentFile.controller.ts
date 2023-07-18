import { Controller, Get, Post, Put, Req, Res } from '@nestjs/common';
import { DocumentFileService } from './documentFile.service';

@Controller('file')
export class DocumentFileController {
  constructor(private readonly documentFileService: DocumentFileService) {}

  @Get()
  getFiles(@Req() req, @Res() res) {
    return this.documentFileService.getFiles(req, res);
  }

  @Get(':id')
  getFileById(@Req() req, @Res() res) {
    return this.documentFileService.getFileById(req, res);
  }

  @Post('add')
  addNewFile(@Req() req, @Res() res) {
    return this.documentFileService.addNewFile(req, res);
  }

  @Put('delete/:id')
  deleteFile(@Req() req, @Res() res) {
    return this.documentFileService.deleteFile(req, res);
  }
}
