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

  async getFiles(req, res) {
    try {
      const files = await this.documentFileRepository.findAll({
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

  async getFileById(req, res) {
    try {
      const file = await this.documentFileRepository.findAll({
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

  async addNewFile(req, res) {
    try {
      const newFile = await this.documentFileRepository.create({
        ...req.body,
      });

      return res.status(errors.success.code).json(newFile);
    } catch (error) {
      console.log(error.message);

      res.sendStatus(errors.internalServerError.code);
    }
  }

  async deleteFile(req, res) {
    try {
      const file = await this.documentFileRepository.findOne({
        where: {
          id: req.params.id,
        },
      });

      await file.update({ statusDelete: true });

      return res.status(errors.success.code).json(file.id);
    } catch (error) {
      res.sendStatus(errors.internalServerError.code);
    }
  }
}
