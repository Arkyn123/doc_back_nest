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
        where: [
          {
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
        ],
      });

      let values = [];

      documents.map((m) =>
        values.push({
          officeName: m.officeName,
          officeId: m.officeId,
          status: m.statusId,
          date: m.dateApplication,
        }),
      );

      const os = { 1: 0, 2: 0, 3: 0, 4: 0 };

      const count = values.reduce((acc, n) => {
        (acc[n.officeName] || (acc[n.officeName] = { ...os }))[n.status]++;
        return acc;
      }, {});

      return res.status(errors.success.code).json(count);
    } catch (e) {
      console.warn(e);
      res.sendStatus(errors.internalServerError.code);
    }
  }
}
