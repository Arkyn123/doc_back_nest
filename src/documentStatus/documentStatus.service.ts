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

  async getAllStatuses(res) {
    try {
      const statuses = await this.documentStatusRepository.findAll();

      return res.status(errors.success.code).json(statuses);
    } catch (e) {
      console.warn(e);
      return res.sendStatus(errors.internalServerError.code);
    }
  }

  async addNewStatus(body, user, res) {
    try {
      const result = await this.documentStatusRepository.create({
        ownerId: user.id,
        ownerFullname: user.fullname,
        ...body,
      });

      return res.status(errors.success.code).json(result);
    } catch (e) {
      console.warn(e.message);
      if (e instanceof ValidationError) {
        return res.sendStatus(errors.badRequest.code);
      }
      return res.sendStatus(errors.internalServerError.code);
    }
  }
}
