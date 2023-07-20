import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DicOffice } from './dicOffice.model';
import errors from 'src/utils/errors';

@Injectable()
export class DicOfficeService {
  constructor(
    @InjectModel(DicOffice)
    private readonly dicOfficeRepository: typeof DicOffice,
  ) {}

  async getAll(req, res) {
    try {
      const filter = { ...req.filter };

      if (!filter.where) {
        filter.where = {};
      } else {
        filter.where = { ...filter.where };
      }

      const dic_office = await this.dicOfficeRepository.findAll({
        ...filter,
        include: [{ all: true, nested: true, duplicating: true }],
      });

      return res.status(errors.success.code).json(dic_office);
    } catch (e) {
      console.warn(e);
      return res.sendStatus(errors.internalServerError.code);
    }
  }

  async addInDictionary(req, res) {
    try {
      const dic_office = await this.dicOfficeRepository.create({
        ...req.body,
        CreatedDate: Date.now(),
        FlagDeleted: false,
      });
      return res.status(errors.success.code).json(dic_office);
    } catch (e) {
      console.warn(e.message);

      return res.sendStatus(errors.internalServerError.code);
    }
  }

  async saveInDictionary(req, res) {
    try {
      const dic_office = await this.dicOfficeRepository.findByPk(req.params.id);

      if (!dic_office) return res.sendStatus(errors.notFound.code);

      await dic_office.update({
        ...req.body,
        UpdatedDate: Date.now(),
      });

      return res.status(errors.success.code).json(dic_office);
    } catch (e) {
      console.warn(e);
      return res.sendStatus(errors.internalServerError.code);
    }
  }

  async delInDictionary(req, res) {
    try {
      const dic_office = await this.dicOfficeRepository.findByPk(req.params.id);

      if (!dic_office) return res.sendStatus(errors.notFound.code);

      await dic_office.update({
        DeletedDate: new Date(Date.now()),
        FlagDeleted: true,
      });

      return res.sendStatus(errors.success.code);
    } catch (e) {
      console.log(e);
      return res.sendStatus(errors.internalServerError.code);
    }
  }
}
