import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { Sequelize } from 'sequelize';
import { config } from '../utils/config';

@Injectable()
export class CheckConnectionWithDB implements NestMiddleware {
  private sequelize: Sequelize;

  constructor() {
    this.sequelize = new Sequelize({
      dialect: config[process.env.NODE_ENV].database.dialect,
      host: config[process.env.NODE_ENV].database.host,
      port: +config[process.env.NODE_ENV].database.port,
      username: config[process.env.NODE_ENV].database.username,
      password: config[process.env.NODE_ENV].database.password,
      database: config[process.env.NODE_ENV].database.database,
    });
  }

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      await this.sequelize.authenticate();
      console.log(
        `DB connected\t${config[process.env.NODE_ENV].database.dialect}://${
          config[process.env.NODE_ENV].database.host
        }:${config[process.env.NODE_ENV].database.port}`,
      );
    } catch (err) {
      console.log('Server cannot connect to database');
    }
    // ===> setWantedPermission
    next();
  }
}
