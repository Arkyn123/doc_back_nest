import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { File } from './file.model';
import errors from 'src/utils/errors';
@Injectable()
export class FileService {
  constructor(
    @InjectModel(File)
    private readonly fileRepository: typeof File,
  ) {}

  async addNewFile(req, res) {
    try {
      const newFile = await this.fileRepository.create({
        ...req.body,
      });
      return res.status(errors.success.code).json(newFile);
    } catch (error) {
      res.sendStatus(errors.internalServerError.code);
    }
  }

  async getFileById(req, res) {
    try {
      const file = await this.fileRepository.findAll({
        where: {
          documentId: req.params.id,
          statusDelete: false,
        },
      });
      return res.status(errors.success.code).json(file);
    } catch (error) {
      res.sendStatus(errors.internalServerError.code);
    }
  }
  async getFiles(req, res) {
    try {
      const files = await this.fileRepository.findAll({
        include: [{ all: true, nested: true, duplicating: true }],
        where: { statusDelete: false },
      });
      return res
        .status(errors.success.code)
        .json(files.map((e) => e.documentId));
    } catch (error) {
      res.sendStatus(errors.internalServerError.code);
    }
  }
  async deleteFile(req, res) {
    try {
      const file = await this.fileRepository.findOne({
        where: {
          id: req.params.id,
        },
      });
      console.log(file);
      await file.update({ statusDelete: true });
      return res.status(errors.success.code).json(file.id);
    } catch (error) {
      res.sendStatus(errors.internalServerError.code);
    }
  }
}
