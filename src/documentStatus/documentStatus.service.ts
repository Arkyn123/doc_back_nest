import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ValidationError } from 'sequelize';
import { DocumentStatus } from './documentStatus.model';
import errors from 'src/utils/errors';

@Injectable()
export class DocumentStatusService {
  constructor(
    @InjectModel(DocumentStatus)
    private readonly documentStatusRepository: typeof DocumentStatus,
  ) {}
  async getAllStatuses(req, res) {
    try {
      const statuses = await this.documentStatusRepository.findAll();
      return res.status(errors.success.code).json(statuses);
    } catch (e) {
      return res.sendStatus(errors.internalServerError.code);
    }
  }
  async addNewStatus(req, res) {
    try {
      const result = await this.documentStatusRepository.create({
        ...req.body,
      });
      return res.status(errors.success.code).json(result.dataValues);
    } catch (e) {
      if (e instanceof ValidationError) {
        return res.sendStatus(errors.badRequest.code);
      }
      return res.sendStatus(errors.internalServerError.code);
    }
  }
}
