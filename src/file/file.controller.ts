import { Controller, Get, Post, Put, Req, Res } from '@nestjs/common';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get()
  getFiles(@Req() req, @Res() res) {
    return this.fileService.getFiles(req, res);
  }

  @Get(':id')
  getFileById(@Req() req, @Res() res) {
    return this.fileService.getFileById(req, res);
  }

  @Post('add')
  addNewFile(@Req() req, @Res() res) {
    return this.fileService.addNewFile(req, res);
  }

  @Put('delete/:id')
  deleteFile(@Req() req, @Res() res) {
    return this.fileService.deleteFile(req, res);
  }
}
