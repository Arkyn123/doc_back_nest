import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import errors from 'src/utils/errors';
import { T_XXHR_SCHEDULE_BRIGADES } from './T_XXHR_SCHEDULE_BRIGADES.model';
import { databaseMSSQL } from '../databases/databaseMSSQL';

@Injectable()
export class FindMssqlService {
  constructor(
    @InjectModel(T_XXHR_SCHEDULE_BRIGADES)
    private readonly t_XXHR_SCHEDULE_BRIGADES: typeof T_XXHR_SCHEDULE_BRIGADES,
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
    try {
      const brigades = await this.t_XXHR_SCHEDULE_BRIGADES.findAll({
        where: {
          WORK_SCHEDULE_ID: req.query.brigades,
        },
      });

      return res.status(errors.success.code).json(brigades);
    } catch (e) {
      console.warn(e);
      return res.sendStatus(errors.internalServerError.code);
    }
  }
}
