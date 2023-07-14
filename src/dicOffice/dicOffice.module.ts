import { Module } from '@nestjs/common';
import { DicOfficeController } from './dicOffice.controller';
import { DicOfficeService } from './dicOfficeservice.model';

@Module({
  controllers: [DicOfficeController],
  providers: [DicOfficeService]
})
export class DicOfficeModule {}
