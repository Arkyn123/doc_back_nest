import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ValidationError } from 'sequelize';
import { DocumentType } from './documentType.model';
import errors from 'src/utils/errors';
@Injectable()
export class DocumentTypeService {
  constructor(
    @InjectModel(DocumentType)
    private readonly documentTypeRepository: typeof DocumentType,
  ) {}

  async getAllDocumentType(res) {
    try {
      const documentTypes = await this.documentTypeRepository.findAll({
        include: [{ all: true, nested: true, duplicating: true }],
      });

      return res.status(errors.success.code).json(documentTypes);
    } catch (e) {
      console.warn(e);
      return res.sendStatus(errors.internalServerError.code);
    }
  }

  async addNewDocumentType(body, res) {
    try {
      const documentType = await this.documentTypeRepository.upsert({
        ...body,
      });

      return res.status(errors.success.code).json(documentType);
    } catch (e) {
      console.warn(e.message);
      if (e instanceof ValidationError) {
        return res.sendStatus(errors.badRequest.code);
      }
      return res.sendStatus(errors.internalServerError.code);
    }
  }
}
