import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { DocumentFileService } from './documentFile.service';

@Controller('file')
export class DocumentFileController {
  constructor(private readonly documentFileService: DocumentFileService) {}

  @Get()
  getFiles(@Res() res) {
    return this.documentFileService.getFiles(res);
  }

  @Get(':id')
  getFileById(@Param() param, @Res() res) {
    return this.documentFileService.getFileById(param, res);
  }

  @Post('add')
  addNewFile(@Body() body, @Res() res) {
    return this.documentFileService.addNewFile(body, res);
  }

  @Put('delete/:id')
  deleteFile(@Param() param, @Res() res) {
    return this.documentFileService.deleteFile(param, res);
  }
}
