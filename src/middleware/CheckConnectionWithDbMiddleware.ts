import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
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
      console.log('Success connection to database');
    } catch (err) {
      console.log('Server cannot connect to database');
    }
    // ===> setWantedPermission
    next();
  }
}
