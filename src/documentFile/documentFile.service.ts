import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DocumentFile } from './documentFile.model';
import errors from 'src/utils/errors';
@Injectable()
export class DocumentFileService {
  constructor(
    @InjectModel(DocumentFile)
    private readonly documentFileRepository: typeof DocumentFile,
  ) {}

  async getFiles(res) {
    try {
      const file = await this.documentFileRepository.findAll({
        include: [{ all: true, nested: true, duplicating: true }],
        where: { statusDelete: false },
      });

      return res
        .status(errors.success.code)
        .json(file.map((e) => e.documentId));
    } catch (e) {
      console.warn(e);
      res.sendStatus(errors.internalServerError.code);
    }
  }

  async getFileById(param, res) {
    try {
      const file = await this.documentFileRepository.findAll({
        where: {
          documentId: param.id,
          statusDelete: false,
        },
      });

      return res.status(errors.success.code).json(file);
    } catch (e) {
      console.warn(e);
      res.sendStatus(errors.internalServerError.code);
    }
  }

  async addNewFile(body, res) {
    try {
      const file = await this.documentFileRepository.create({
        ...body,
      });

      return res.status(errors.success.code).json(file);
    } catch (e) {
      console.warn(e);
      res.sendStatus(errors.internalServerError.code);
    }
  }

  async deleteFile(param, res) {
    try {
      const file = await this.documentFileRepository.findOne({
        where: {
          id: param.id,
        },
      });

      await file.update({ statusDelete: true });

      return res.status(errors.success.code).json(file.id);
    } catch (e) {
      console.warn(e);
      res.sendStatus(errors.internalServerError.code);
    }
  }
}
