import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { File } from './file.model';

@Module({
  controllers: [FileController],
  providers: [FileService],
  imports: [SequelizeModule.forFeature([File])],
})
export class FileModule {}
