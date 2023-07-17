import { Controller, Delete, Get, Post, Req, Res } from '@nestjs/common';
import { DocumentRouteService } from './documentRoute.service';

@Controller('documentRoute')
export class DocumentRouteController {
  constructor(private readonly documentRouteService: DocumentRouteService) {}

  @Get()
  getAllDocumentRoute(@Req() req, @Res() res) {
    return this.documentRouteService.getAllDocumentRoute(req, res);
  }

  @Get(':documentTypeId')
  getDocumentRouteByDocumentTypeId(@Req() req, @Res() res) {
    return this.documentRouteService.getDocumentRouteByDocumentTypeId(req, res);
  }

  @Post('add')
  addNewDocumentRoute(@Req() req, @Res() res) {
    return this.documentRouteService.addNewDocumentRoute(req, res);
  }

  @Delete('delete/:documentTypeId')
  deleteDocumentRouteById(@Req() req, @Res() res) {
    return this.documentRouteService.deleteDocumentRouteById(req, res);
  }
}
