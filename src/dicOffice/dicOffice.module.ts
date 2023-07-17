import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { DicOfficeController } from './dicOffice.controller';
import { DicOfficeService } from './dicOffice.service';
import { DicOffice } from './dicOffice.model';

@Module({
  controllers: [DicOfficeController],
  providers: [DicOfficeService],
  imports: [SequelizeModule.forFeature([DicOffice])],
})
export class DicOfficeModule {}
