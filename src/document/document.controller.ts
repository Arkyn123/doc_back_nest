import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  UseGuards,
  Res,
  Req,
  Query,
  Body,
  Param,
} from '@nestjs/common';
import { User, Filter } from 'src/utils/custom.decorators';
import { DocumentService } from './document.service';
import { DocumentDTO } from './dto/DocumentDTO';
import { UpdateDocumentDTO } from './dto/updateDocumentDTO';

import { PermGuard } from '../guards/permGuard';

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Get()
  getAllDocuments(@Filter() filter, @User() user, @Query() query, @Res() res) {
    return this.documentService.getAllDocument(filter, query, user, res);
  }

  @Get('/:documentId')
  getDocumentById(@Param() param, @Req() req, @Res() res) {
    return this.documentService.getDocumentById(param, res);
  }

  @Post('/add')
  addNewDocument(@User() user, @Body() body, @Res() res) {
    return this.documentService.addNewDocument(user, body, res);
  }

  @Post('/addInDraft')
  addNewDocumentInDraft(@User() user, @Body() body, @Res() res) {
    return this.documentService.addNewDocumentInDraft(user, body, res);
  }

  @UseGuards(PermGuard)
  @Put('/update/:documentId')
  async updateDocumentByDocumentId(
    @User() user,
    @Param() param,
    @Body() body,
    @Res() res,
  ) {
    return this.documentService.updateDocumentByDocumentId(
      user,
      param,
      body,
      res,
    );
  }

  @UseGuards(PermGuard)
  @Put('/updateFromDraftAndRevision/:documentId')
  updateDocumentFromDraftAndRevisionByDocumentId(
    @User() user,
    @Param() param,
    @Body() body,

    @Res() res,
  ) {
    return this.documentService.updateDocumentFromDraftAndRevisionByDocumentId(
      user,
      param,
      body,
      res,
    );
  }

  @UseGuards(PermGuard)
  @Put('/updateInfoForRole/:documentId')
  updateInfoForRole(
    @User() user,
    @Param() param,
    @Body() body,

    @Res() res,
  ) {
    return this.documentService.updateDocumentInfoForRole(
      user,
      param,
      body,
      res,
    );
  }

  @UseGuards(PermGuard)
  @Put('/updateDocumentFlagDeleted/:documentId')
  updateDocumentFlagDeleted(
    @Param() param,
    @Body() body,
    @Req() req,
    @Res() res,
  ) {
    return this.documentService.updateDocumentFlagDeleted(
      param,
      body,
      req,
      res,
    );
  }

  @Delete('/delete')
  deleteAllDocuments(@Res() res) {
    return this.documentService.deleteAllDocuments(res);
  }
}
