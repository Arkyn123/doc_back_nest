import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import errors from 'src/utils/errors';
import { T_XXHR_SCHEDULE_BRIGADES } from './T_XXHR_SCHEDULE_BRIGADES.model';
import { T_XXHR_OSK_ORG_HIERARHY_V } from './T_XXHR_OSK_ORG_HIERARHY_V.model';
import { T_XXHR_OSK_ASSIGNMENTS_V } from './T_XXHR_OSK_ASSIGNMENTS_V.model';
import { T_XXHR_OSK_POSITIONS } from './T_XXHR_OSK_POSITIONS.model';
import { databaseMSSQL } from '../databases/databaseMSSQL';
import { Op, literal } from 'sequelize';
import { T_XXHR_WORK_SCHEDULES } from './T_XXHR_WORK_SCHEDULES.model';

@Injectable()
export class FindMssqlService {
  constructor(
    @InjectModel(T_XXHR_SCHEDULE_BRIGADES)
    private readonly t_XXHR_SCHEDULE_BRIGADES_V: typeof T_XXHR_SCHEDULE_BRIGADES,
  ) {}

  async getAllSchedule(req, res) {
    try {
      const [results, metadata] = await databaseMSSQL.query(`
      select distinct
      a.ORG_ID,
      (select ORG_NAME from T_XXHR_OSK_ORG_HIERARHY_V where ORGANIZATION_ID = a.ORG_ID and DATE_TO > GETDATE() and TYPE != 02) as ORG_NAME,
      c.PARENT_ORG_ID, 
      c.PARENT_ORG_NAME, 
      a.POSITION_ID, 
      a.POSITION_NAME, 
      b.TYPE_NAME,
      (select distinct ORG_NAME from T_XXHR_OSK_ORG_HIERARHY_V where ORGANIZATION_ID = b.ORGANIZATION_ID_PARENT and DATE_TO > GETDATE() and b.TYPE != 02 and b.TYPE != 03) as SECTOR
      from [T_XXHR_OSK_POSITIONS] a
      join [T_XXHR_OSK_ORG_HIERARHY_V] b on a.ORG_ID=b.ORGANIZATION_ID
      join [T_XXHR_OSK_ASSIGNMENTS_V] c on a.ORG_ID=c.ORG_ID
      where (b.DATE_TO > GETDATE()) and (a.POSITION_ID like '%${req.query.position}%' or a.POSITION_NAME like '%${req.query.position}%') 
`);

      const { Op } = require('sequelize');

      let positions = await T_XXHR_OSK_POSITIONS.findAll({
        attributes: ['ORG_ID', 'POSITION_ID', 'POSITION_NAME'],
        where: {
          [Op.or]: [
            {
              POSITION_ID: {
                [Op.like]: `%${req.query.position}%`,
              },
            },
            {
              POSITION_NAME: {
                [Op.like]: `%${req.query.position}%`,
              },
            },
          ],
        },
        include: [
          {
            model: T_XXHR_OSK_ASSIGNMENTS_V,
            attributes: ['PARENT_ORG_ID', 'PARENT_ORG_NAME'],
            on: {
              ORG_ID: { [Op.col]: 'T_XXHR_OSK_POSITIONS.ORG_ID' },
            },
          },
          {
            model: T_XXHR_OSK_ORG_HIERARHY_V,
            attributes: ['TYPE_NAME'],
            on: {
              ORGANIZATION_ID: { [Op.col]: 'T_XXHR_OSK_POSITIONS.ORG_ID' },
            },
          },
        ],
      });

      function removeDuplicatesFromArray(arr) {
        return arr.filter(
          (item, index) =>
            arr.findIndex(
              (elem) => JSON.stringify(elem) === JSON.stringify(item),
            ) === index,
        );
      }

      return res
        .status(errors.success.code)
        .json(removeDuplicatesFromArray(positions));
    } catch (e) {
      console.warn(e.message);
      if (e?.original['errors']?.length)
        console.warn(e?.original['errors'], e?.original['errors'].length);

      return res.sendStatus(errors.internalServerError.code);
    }
  }

  async getAllBrigada(req, res) {
    try {
      const results = await T_XXHR_WORK_SCHEDULES.findAll({
        where: {
          CODE: {
            [Op.like]: `%${req.query.brigada}%`,
          },
        },
        attributes: ['WORK_SCHEDULE_ID', ['CODE', 'SCHEDULE'], 'NAME'],
        raw: true,
      });

      return res.status(errors.success.code).json(results);
    } catch (e) {
      console.warn(e);
      return res.sendStatus(errors.internalServerError.code);
    }
  }

  async getAllBrigades(req, res) {
    console.log(req.query.brigades);

    try {
      const brigades = await T_XXHR_SCHEDULE_BRIGADES.findAll({
        where: {
          WORK_SCHEDULE_ID: req.query.brigades,
        },
        attributes: ['WORK_SCHEDULE_ID', 'BRIGADE'],
        raw: true,
      });

      return res.status(errors.success.code).json(brigades);
    } catch (e) {
      console.warn(e.message);
      return res.sendStatus(errors.internalServerError.code);
    }
  }
}
