import { Module } from '@nestjs/common';
import { DicOfficeCorrespondenceController } from './dicOfficeCorrespondence.controller';

@Module({
  controllers: [DicOfficeCorrespondenceController]
})
export class DicOfficeCorrespondenceModule {}
