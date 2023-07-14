import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
  Res,
  Req,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentDTO } from './dto/DocumentDTO';
import { UpdateDocumentDTO } from './dto/updateDocumentDTO';

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Get()
  getAllDocuments(@Req() req, @Res() res) {
    return this.documentService.getAllDocuments(req, res);
  }

  @Get('/:documentId')
  getDocumentById(@Param('documentId') documentId: string) {
    return this.documentService.getDocumentById(documentId);
  }

  @Post('/add')
  addNewDocument(@Body() documentDTO: DocumentDTO) {
    return this.documentService.addNewDocument(documentDTO);
  }

  @Post('/addInDraft')
  addNewDocumentInDraft(@Body() documentDTO: DocumentDTO) {
    return this.documentService.addNewDocumentInDraft(documentDTO);
  }

  @Put('/update/:documentId')
  updateDocumentInfoForRole(
    @Param('documentId') documentId: string,
    @Body() updateDocumentDTO: UpdateDocumentDTO,
  ) {
    return this.documentService.updateDocumentInfoForRole(
      documentId,
      updateDocumentDTO,
    );
  }

  @Put('/updateFromDraftAndRevision/:documentId')
  updateDocumentFromDraftAndRevisionByDocumentId(
    @Param('documentId') documentId: string,
  ) {
    return this.documentService.updateDocumentFromDraftAndRevisionByDocumentId(
      documentId,
    );
  }

  @Put('/updateInfoForRole/:documentId')
  updateInfoForRole(
    @Param('documentId') documentId: string,
    @Body() updateDocumentDTO: UpdateDocumentDTO,
  ) {
    return this.documentService.updateDocumentInfoForRole(
      documentId,
      updateDocumentDTO,
    );
  }

  @Put('/updateDocumentFlagDeleted/:documentId')
  updateDocumentFlagDeleted(@Param('documentId') documentId: string) {
    return this.documentService.updateDocumentFlagDeleted(documentId);
  }

  @Delete('/delete')
  deleteAllDocuments() {
    return this.documentService.deleteAllDocuments();
  }
}
