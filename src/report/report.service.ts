import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Document } from 'src/document/document.model';
import errors from 'src/utils/errors';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(Document)
    private readonly documentRepository: typeof Document,
  ) {}

  async getAllDocumentsInfo(req, res) {
    try {
      const documents = await this.documentRepository.findAll({
        attributes: ['officeName', 'officeId', 'statusId', 'dateApplication'],
        where: {
          dateApplication: {
            [Op.between]: [
              new Date(req.body.startDate),
              new Date(req.body.endDate),
            ],
          },
          flagDeleted: {
            [Op.not]: true,
          },
        },
      });

      if (!documents)
        return res
          .status(errors.notFound.code)
          .json({ message: 'Не найдены документы' });

      const os = { 1: 0, 2: 0, 3: 0, 4: 0 };

      const count = documents.reduce((acc, m) => {
        (acc[m.officeName] || (acc[m.officeName] = { ...os }))[m.statusId]++;
        return acc;
      }, {});

      return res.status(errors.success.code).json(count);
    } catch (e) {
      console.warn(e.message);
      res.sendStatus(errors.internalServerError.code);
    }
  }
}
