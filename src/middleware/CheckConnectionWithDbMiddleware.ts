import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Sequelize } from 'sequelize';
import { config } from '../utils/config';

@Injectable()
export class CheckConnectionWithDB implements NestMiddleware {
  private sequelize: Sequelize;

  constructor() {
    const databaseConfig = config[process.env.NODE_ENV].database;
    this.sequelize = new Sequelize({
      dialect: databaseConfig.dialect,
      host: databaseConfig.host,
      port: +databaseConfig.port,
      username: databaseConfig.username,
      password: databaseConfig.password,
      database: databaseConfig.database,
    });
  }

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      await this.sequelize.authenticate();
      const { dialect, host, port } = config[process.env.NODE_ENV].database;
      console.log(`DB connected\t${dialect}://${host}:${port}`);
    } catch (err) {
      console.log('Server cannot connect to the database');
    }
    
    next();
  }
}
