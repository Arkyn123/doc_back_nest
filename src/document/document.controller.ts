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
  Next,
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
    return this.documentService.getAllDocument(req, res);
  }

  @Get('/:documentId')
  getDocumentById(@Req() req, @Res() res) {
    return this.documentService.getDocumentById(req, res);
  }

  // @Post('/add')
  // addNewDocument(@Req() req, @Res() res) {
  //   return this.documentService.addNewDocument(req, res);
  // }

  // @Post('/addInDraft')
  // addNewDocumentInDraft(@Req() req, @Res() res) {
  //   return this.documentService.addNewDocumentInDraft(req, res);
  // }

  // @UseGuards(PermGuard)
  // @Put('/update/:documentId')
  // async updateDocumentByDocumentId(@Req() req, @Res() res, @Next() next) {
  //   await this.documentService.updateDocumentInfoForRole(req, res, next);
  //   return this.documentService.updateDocumentByDocumentId(req, res);
  // }

  // // @UseGuards(PermGuard)
  // @Put('/updateFromDraftAndRevision/:documentId')
  // updateDocumentFromDraftAndRevisionByDocumentId(@Req() req, @Res() res) {
  //   return this.documentService.updateDocumentFromDraftAndRevisionByDocumentId(
  //     req,
  //     res,
  //   );
  // }

  // // @UseGuards(PermGuard)
  // @Put('/updateInfoForRole/:documentId')
  // updateInfoForRole(@Req() req, @Res() res, @Next() next) {
  //   return this.documentService.updateDocumentInfoForRole(req, res, next);
  // }

  // // @UseGuards(PermGuard)
  // @Put('/updateDocumentFlagDeleted/:documentId')
  // updateDocumentFlagDeleted(@Req() req, @Res() res) {
  //   return this.documentService.updateDocumentFlagDeleted(req, res);
  // }

  // @Delete('/delete')
  // deleteAllDocuments(@Res() res) {
  //   return this.documentService.deleteAllDocuments(res);
  // }
}
