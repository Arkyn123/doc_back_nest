import { Body, Controller, Get, Param, Post, Put, Res } from '@nestjs/common';
import { DicOfficeService } from './dicOffice.service';
import { Filter } from 'src/utils/customDecorators';

@Controller('dicOffice')
export class DicOfficeController {
  constructor(private readonly dicOfficeService: DicOfficeService) {}

  @Get()
  getAll(@Filter() filter, @Res() res) {
    return this.dicOfficeService.getAll(filter, res);
  }

  @Post('/add')
  addInDictionary(@Body() body, @Res() res) {
    return this.dicOfficeService.addInDictionary(body, res);
  }

  @Put('/update/:id')
  saveInDictionary(@Param() param, @Body() body, @Res() res) {
    return this.dicOfficeService.saveInDictionary(body, param, res);
  }

  @Put('/delete/:id')
  delInDictionary(@Param() param, @Res() res) {
    return this.dicOfficeService.delInDictionary(param, res);
  }
}
