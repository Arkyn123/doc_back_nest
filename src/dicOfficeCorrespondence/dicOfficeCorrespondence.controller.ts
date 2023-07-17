import { Controller, Get, Post, Put, Req, Res } from '@nestjs/common';
import { SequelizeFiltering } from '../middleware/SequelizeFilteringMiddleware';
import { DicOfficeCorrespondenceService } from './dicOfficeCorrespondence.service';

@Controller('dicOfficeCorrespondence')
export class DicOfficeCorrespondenceController {
  constructor(
    private readonly dicOfficeCorrespondenceService: DicOfficeCorrespondenceService,
  ) {}

  @Get()
  getAll(@Req() req, @Res() res) {
    return this.dicOfficeCorrespondenceService.getAll(req, res);
  }

  @Post('/add')
  addInDictionary(@Req() req, @Res() res) {
    return this.dicOfficeCorrespondenceService.addInDictionary(req, res);
  }

  @Put('/update/:id')
  saveInDictionary(@Req() req, @Res() res) {
    return this.dicOfficeCorrespondenceService.saveInDictionary(req, res);
  }

  @Put('/delete/:id')
  delInDictionary(@Req() req, @Res() res) {
    return this.dicOfficeCorrespondenceService.delInDictionary(req, res);
  }
}
