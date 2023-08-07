import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import errors from 'src/utils/errors';
import { T_XXHR_SCHEDULE_BRIGADES } from './T_XXHR_SCHEDULE_BRIGADES.model';
import { T_XXHR_OSK_ORG_HIERARHY_V } from './T_XXHR_OSK_ORG_HIERARHY_V.model';
import { T_XXHR_OSK_ASSIGNMENTS_V } from './T_XXHR_OSK_ASSIGNMENTS_V.model';
import { T_XXHR_OSK_POSITIONS } from './T_XXHR_OSK_POSITIONS.model';
import { Op, literal, col, fn } from 'sequelize';
import { T_XXHR_WORK_SCHEDULES } from './T_XXHR_WORK_SCHEDULES.model';

@Injectable()
export class FindMssqlService {
  constructor(
    @InjectModel(T_XXHR_SCHEDULE_BRIGADES)
    private readonly t_XXHR_SCHEDULE_BRIGADES_V: typeof T_XXHR_SCHEDULE_BRIGADES,
  ) {}

  async getAllSchedule(query, res) {
    try {
      const { Op } = require('sequelize');

      let positions = await T_XXHR_OSK_POSITIONS.findAll({
        attributes: [
          'ORG_ID',
          'T_XXHR_OSK_ORG_HIERARHY_V.ORG_NAME',
          'T_XXHR_OSK_ASSIGNMENTS_V.PARENT_ORG_ID',
          'T_XXHR_OSK_ASSIGNMENTS_V.PARENT_ORG_NAME',
          'POSITION_ID',
          'POSITION_NAME',
          'T_XXHR_OSK_ORG_HIERARHY_V.TYPE_NAME',
          [
            col('T_XXHR_OSK_ORG_HIERARHY_V.T_XXHR_OSK_ORG_HIERARHY_V.ORG_NAME'),
            'SECTOR',
          ],
        ],

        include: [
          {
            model: T_XXHR_OSK_ASSIGNMENTS_V,
            attributes: [],
            on: {
              ORG_ID: { [Op.col]: 'T_XXHR_OSK_POSITIONS.ORG_ID' },
            },
          },
          {
            model: T_XXHR_OSK_ORG_HIERARHY_V,
            attributes: [],
            on: {
              ORGANIZATION_ID: { [Op.col]: 'T_XXHR_OSK_POSITIONS.ORG_ID' },
            },
            include: [
              {
                model: T_XXHR_OSK_ORG_HIERARHY_V,
                attributes: [],
                on: {
                  ORGANIZATION_ID: {
                    [Op.col]:
                      'T_XXHR_OSK_ORG_HIERARHY_V.ORGANIZATION_ID_PARENT',
                  },
                  DATE_TO: {
                    [Op.gt]: Date.now(),
                  },
                  TYPE: {
                    [Op.ne]: '02',
                  },
                },
              },
            ],
          },
        ],
        where: {
          [Op.or]: [
            {
              POSITION_ID: {
                [Op.like]: `%${query.position}%`,
              },
            },
            {
              POSITION_NAME: {
                [Op.like]: `%${query.position}%`,
              },
            },
          ],
        },
        raw: true,
      });

      function removeDuplicatesFromArray(arr) {
        const uniqueSet = new Set();
        const result = [];
        for (const item of arr) {
          const serializedItem = JSON.stringify(item);
          if (!uniqueSet.has(serializedItem)) {
            uniqueSet.add(serializedItem);
            result.push(item);
          }
        }
        return result;
      }

      function removeObjectsWithNullParent(arr) {
        return arr.filter(
          (item) =>
            item.PARENT_ORG_ID !== null && item.PARENT_ORG_NAME !== null,
        );
      }

      function transformOrgData(arr) {
        return arr.map((item) => {
          if (item.ORG_NAME === item.PARENT_ORG_NAME) item.ORG_NAME = null;
          if (item.ORG_NAME === null) item.SECTOR = null;
          return item;
        });
      }

      return res
        .status(errors.success.code)
        .json(
          transformOrgData(
            removeObjectsWithNullParent(removeDuplicatesFromArray(positions)),
          ),
        );
    } catch (e) {
      console.warn(e.message);
      if (e?.original['errors']?.length)
        console.warn(e?.original['errors'], e?.original['errors'].length);

      return res.sendStatus(errors.internalServerError.code);
    }
  }

  async getAllBrigada(query, res) {
    try {
      const results = await T_XXHR_WORK_SCHEDULES.findAll({
        where: {
          CODE: {
            [Op.like]: `%${query.brigada}%`,
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

  async getAllBrigades(query, res) {
    try {
      const brigades = await T_XXHR_SCHEDULE_BRIGADES.findAll({
        where: {
          WORK_SCHEDULE_ID: query.brigades,
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
