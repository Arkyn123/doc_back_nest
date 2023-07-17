import { Controller, Get, Post, Put, Req, Res } from '@nestjs/common';
import { DicOfficeService } from './dicOffice.service';

@Controller('dicOffice')
export class DicOfficeController {
  constructor(private readonly dicOfficeService: DicOfficeService) {}

  @Get()
  getAll(@Req() req, @Res() res) {
    return this.dicOfficeService.getAll(req, res);
  }

  @Post('/add')
  addInDictionary(@Req() req, @Res() res) {
    return this.dicOfficeService.addInDictionary(req, res);
  }

  @Put('/update/:id')
  saveInDictionary(@Req() req, @Res() res) {
    return this.dicOfficeService.saveInDictionary(req, res);
  }

  @Put('/delete/:id')
  delInDictionary(@Req() req, @Res() res) {
    return this.dicOfficeService.delInDictionary(req, res);
  }
}
