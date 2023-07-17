import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { DicOfficeCorrespondenceController } from './dicOfficeCorrespondence.controller';
import { DicOfficeCorrespondenceService } from './dicOfficeCorrespondence.service';
import { DicOfficeCorrespondence } from './dicOfficeCorrespondence.model';

@Module({
  controllers: [DicOfficeCorrespondenceController],
  providers: [DicOfficeCorrespondenceService],
  imports: [SequelizeModule.forFeature([DicOfficeCorrespondence])],
})
export class DicOfficeCorrespondenceModule {}
