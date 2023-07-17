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

  async getAllDocumentType(req, res) {
    try {
      const documentTypes = await this.documentTypeRepository.findAll({
        include: [{ all: true, nested: true, duplicating: true }],
      });
      return res.status(errors.success.code).json(documentTypes);
    } catch (e) {
      return res.sendStatus(errors.internalServerError.code);
    }
  }
  async addNewDocumentType(req, res) {
    try {
      const result = await this.documentTypeRepository.upsert({ ...req.body });
      return res.status(errors.success.code).json(result); //result.dataValues
    } catch (e) {
      console.log(e);
      if (e instanceof ValidationError) {
        return res.sendStatus(errors.badRequest.code);
      }
      return res.sendStatus(errors.internalServerError.code);
    }
  }
}
