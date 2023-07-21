import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import errors from 'src/utils/errors';
import { T_XXHR_SCHEDULE_BRIGADES } from './T_XXHR_SCHEDULE_BRIGADES.model';
import { T_XXHR_OSK_ORG_HIERARHY_V } from './T_XXHR_OSK_ORG_HIERARHY_V.model';
import { T_XXHR_OSK_ASSIGNMENTS_V } from './T_XXHR_OSK_ASSIGNMENTS_V.model';
import { T_XXHR_OSK_POSITIONS } from './T_XXHR_OSK_POSITIONS.model';
import { databaseMSSQL } from '../databases/databaseMSSQL';
import { Op, or, fn, col, where, literal } from 'sequelize';

@Injectable()
export class FindMssqlService {
  constructor(
    @InjectModel(T_XXHR_SCHEDULE_BRIGADES)
    private readonly t_XXHR_SCHEDULE_BRIGADES_V: typeof T_XXHR_SCHEDULE_BRIGADES,
  ) {}

  async getAllSchedule(req, res) {
    try {
      const results = await T_XXHR_OSK_POSITIONS.findAll({
        attributes: [
          'ORG_ID',
          [
            literal(
              `(select ORG_NAME from T_XXHR_OSK_ORG_HIERARHY_V where ORGANIZATION_ID = T_XXHR_OSK_POSITIONS.ORG_ID and DATE_TO > GETDATE() and TYPE != '02')`,
            ),
            'ORG_NAME',
          ],
        ],
        include: [
          {
            model: T_XXHR_OSK_ASSIGNMENTS_V,
            as: 'assignment',
            attributes: [
              'PARENT_ORG_ID',
              'PARENT_ORG_NAME',
              'POSITION_ID',
              'POSITION_NAME',
            ],
            include: [
              {
                model: T_XXHR_OSK_ORG_HIERARHY_V,
                as: 'orgHierarchy',
                attributes: ['ORG_NAME'],
                where: {
                  DATE_TO: {
                    [Op.gt]: new Date(),
                  },
                  TYPE: {
                    [Op.notIn]: ['03', '02'],
                  },
                },
              },
            ],
          },
        ],
        where: {
          [Op.or]: [
            { POSITION_ID: { [Op.like]: `%${req.query.position}%` } as any },
            { POSITION_NAME: { [Op.like]: `%${req.query.position}%` } as any },
          ],
        },
        raw: true, // To return raw query results without model instances
      });

      return res.status(errors.success.code).json(results);
    } catch (e) {
      console.warn(e.message);

      // console.warn(e?.original['errors'], e?.original['errors'].length);

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
