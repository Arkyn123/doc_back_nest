import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DicOfficeCorrespondence } from './dicOfficeCorrespondence.model';
import errors from 'src/utils/errors';

@Injectable()
export class DicOfficeCorrespondenceService {
  constructor(
    @InjectModel(DicOfficeCorrespondence)
    private readonly dicOfficeCorrespondenceRepository: typeof DicOfficeCorrespondence,
  ) {}

  async getAll(filter, res) {
    try {
      if (!filter.where) {
        filter.where = {};
      } else {
        filter.where = { ...filter.where };
      }

      const dic_office_correspondence =
        await this.dicOfficeCorrespondenceRepository.findAll({
          ...filter,
          include: [{ all: true, nested: true, duplicating: true }],
        });

      return res.status(errors.success.code).json(dic_office_correspondence);
    } catch (e) {
      console.warn(e);
      return res.sendStatus(errors.internalServerError.code);
    }
  }

  async addInDictionary(body, res) {
    try {
      const dic_office_correspondence =
        await this.dicOfficeCorrespondenceRepository.create({
          ...body,
          CreatedDate: Date.now(),
          FlagDeleted: false,
        });

      return res.status(errors.success.code).json(dic_office_correspondence);
    } catch (e) {
      console.warn(e);
      return res.sendStatus(errors.internalServerError.code);
    }
  }

  async saveInDictionary(body, param, res) {
    try {
      const dic_office_correspondence =
        await this.dicOfficeCorrespondenceRepository.findByPk(param.id);

      if (!dic_office_correspondence)
        return res.sendStatus(errors.notFound.code);

      await dic_office_correspondence.update({
        ...body,
        UpdatedDate: Date.now(),
      });

      return res.status(errors.success.code).json(dic_office_correspondence);
    } catch (e) {
      console.warn(e);
      return res.sendStatus(errors.internalServerError.code);
    }
  }

  async delInDictionary(param, res) {
    try {
      const dic_office_correspondence =
        await this.dicOfficeCorrespondenceRepository.findByPk(param.id);

      if (!dic_office_correspondence)
        return res.sendStatus(errors.notFound.code);

      await dic_office_correspondence.update({
        DeletedDate: new Date(Date.now()),
        FlagDeleted: true,
      });

      return res.sendStatus(errors.success.code);
    } catch (e) {
      console.warn(e);
      return res.sendStatus(errors.internalServerError.code);
    }
  }
}
