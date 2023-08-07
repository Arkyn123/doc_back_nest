import { Body, Controller, Get, Param, Post, Put, Res } from '@nestjs/common';
import { DicOfficeCorrespondenceService } from './dicOfficeCorrespondence.service';
import { Filter } from 'src/utils/customDecorators';

@Controller('dicOfficeCorrespondence')
export class DicOfficeCorrespondenceController {
  constructor(
    private readonly dicOfficeCorrespondenceService: DicOfficeCorrespondenceService,
  ) {}

  @Get()
  getAll(@Filter() filter, @Res() res) {
    return this.dicOfficeCorrespondenceService.getAll(filter, res);
  }

  @Post('/add')
  addInDictionary(@Body() body, @Res() res) {
    return this.dicOfficeCorrespondenceService.addInDictionary(body, res);
  }

  @Put('/update/:id')
  saveInDictionary(@Body() body, @Param() param, @Res() res) {
    return this.dicOfficeCorrespondenceService.saveInDictionary(
      body,
      param,
      res,
    );
  }

  @Put('/delete/:id')
  delInDictionary(@Param() param, @Res() res) {
    return this.dicOfficeCorrespondenceService.delInDictionary(param, res);
  }
}
