import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { DocumentTypeService } from './documentType.service';

@Controller('documentType')
export class DocumentTypeController {
  constructor(private readonly documentTypeService: DocumentTypeService) {}

  @Get()
  getAllDocumentTypes(@Req() req, @Res() res) {
    return this.documentTypeService.getAllDocumentType(req, res);
  }

  @Post('add')
  addNewDocumentType(@Req() req, @Res() res) {
    return this.documentTypeService.addNewDocumentType(req, res);
  }
}
