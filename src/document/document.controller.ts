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

import { MyGuard } from '../guards/guard';
import { PermGuard } from '../guards/permGuard';

@UseGuards(MyGuard)
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

  @UseGuards(PermGuard)
  @Put('/update/:documentId')
  updateDocumentByDocumentId(
    @Param('documentId') documentId: string,
    @Body() updateDocumentDTO: UpdateDocumentDTO,
  ) {
    return this.documentService.updateDocumentByDocumentId(
      documentId,
      updateDocumentDTO,
    );
  }
  @UseGuards(PermGuard)
  @Put('/updateFromDraftAndRevision/:documentId')
  updateDocumentFromDraftAndRevisionByDocumentId(
    @Param('documentId') documentId: string,
  ) {
    return this.documentService.updateDocumentFromDraftAndRevisionByDocumentId(
      documentId,
    );
  }

  @UseGuards(PermGuard)
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

  @UseGuards(PermGuard)
  @Put('/updateDocumentFlagDeleted/:documentId')
  updateDocumentFlagDeleted(@Param('documentId') documentId: string) {
    return this.documentService.updateDocumentFlagDeleted(documentId);
  }

  @Delete('/delete')
  deleteAllDocuments() {
    return this.documentService.deleteAllDocuments();
  }
}
