import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { DocumentRouteService } from './documentRoute.service';
import { User } from 'src/utils/custom.decorators';

@Controller('documentRoute')
export class DocumentRouteController {
  constructor(private readonly documentRouteService: DocumentRouteService) {}

  @Get()
  getAllDocumentRoute(@Res() res) {
    return this.documentRouteService.getAllDocumentRoute(res);
  }

  @Get(':documentTypeId')
  getDocumentRouteByDocumentTypeId(@Param() param, @Res() res) {
    return this.documentRouteService.getDocumentRouteByDocumentTypeId(
      param,
      res,
    );
  }

  @Post('add')
  addNewDocumentRoute(@Body() body, @User() user, @Res() res) {
    return this.documentRouteService.addNewDocumentRoute(body, user, res);
  }

  @Delete('delete/:documentTypeId')
  deleteDocumentRouteById(@Param() param, @Res() res) {
    return this.documentRouteService.deleteDocumentRouteById(param, res);
  }
}
