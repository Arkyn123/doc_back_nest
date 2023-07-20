import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import errors from 'src/utils/errors';
import { T_XXHR_SCHEDULE_BRIGADES_V } from './T_XXHR_SCHEDULE_BRIGADES_V.model';
import { T_XXHR_OSK_ORG_HIERARHY_V } from './T_XXHR_OSK_ORG_HIERARHY_V.model';
import { T_XXHR_OSK_ASSIGNMENTS_V } from './T_XXHR_OSK_ASSIGNMENTS_V.model';
import { databaseMSSQL } from '../databases/databaseMSSQL';
import { Op, or, fn, col, where, literal } from 'sequelize';

@Injectable()
export class FindMssqlService {
  constructor(
    @InjectModel(T_XXHR_SCHEDULE_BRIGADES_V)
    private readonly t_XXHR_SCHEDULE_BRIGADES_V: typeof T_XXHR_SCHEDULE_BRIGADES_V,
  ) {}

  async getAllSchedule(req, res) {
    try {
      const results = await T_XXHR_SCHEDULE_BRIGADES_V.findAll({
        attributes: ['ORG_ID'],
        include: [
          {
            model: T_XXHR_OSK_ORG_HIERARHY_V,
            as: 'organization',
            attributes: ['ORG_NAME'],
            where: {
              DATE_TO: {
                [Op.gt]: new Date(),
              },
              TYPE: {
                [Op.ne]: '02',
              },
            },
          },
          {
            model: T_XXHR_OSK_ASSIGNMENTS_V,
            as: 'assignments',
            attributes: ['PARENT_ORG_ID', 'PARENT_ORG_NAME'],
            include: [
              {
                model: T_XXHR_OSK_ORG_HIERARHY_V,
                as: 'organization',
                attributes: ['ORG_NAME'],
                where: {
                  DATE_TO: {
                    [Op.gt]: new Date(),
                  },
                  TYPE: {
                    [Op.notIn]: ['02', '03'],
                  },
                },
              },
            ],
          },
        ],
        where: or(
          { POSITION_ID: { [Op.like]: `%${req.query.position}%` } },
          { POSITION_NAME: { [Op.like]: `%${req.query.position}%` } },
        ),
      });

      return res.status(errors.success.code).json(results);
    } catch (e) {
      console.warn(e);
      return res.sendStatus(errors.internalServerError.code);
    }
  }

  async getAllBrigada(req, res) {
    try {
      const [results, metadata] = await databaseMSSQL.query(
        `SELECT distinct WORK_SCHEDULE_ID, CODE as SCHEDULE, NAME from T_XXHR_WORK_SCHEDULES WHERE CODE LIKE '%${req.query.brigada}%'`,
      );

      return res.status(errors.success.code).json(results);
    } catch (e) {
      console.warn(e);
      return res.sendStatus(errors.internalServerError.code);
    }
  }

  async getAllBrigades(req, res) {
    console.log(req.query.brigades);

    try {
      const brigades = await this.t_XXHR_SCHEDULE_BRIGADES_V.findAll({
        where: {
          WORK_SCHEDULE_ID: req.query.brigades,
        },
        attributes: ['WORK_SCHEDULE_ID', 'BRIGADE', 'NOTE'],
      });

      return res.status(errors.success.code).json(brigades);
    } catch (e) {
      console.warn(e.message);
      return res.sendStatus(errors.internalServerError.code);
    }
  }
}
