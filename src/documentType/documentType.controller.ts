import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { DocumentTypeService } from './documentType.service';

@Controller('documentType')
export class DocumentTypeController {
  constructor(private readonly documentTypeService: DocumentTypeService) {}

  @Get()
  getAllDocumentTypes(@Res() res) {
    return this.documentTypeService.getAllDocumentType(res);
  }

  @Post('add')
  addNewDocumentType(@Body() body, @Res() res) {
    return this.documentTypeService.addNewDocumentType(body, res);
  }
}
