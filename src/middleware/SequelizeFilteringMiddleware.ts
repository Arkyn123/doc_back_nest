import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Sequelize } from 'sequelize';
import { config } from '../utils/config';
import { SearchBuilder } from 'sequelize-search-builder';

@Injectable()
export class SequelizeFiltering implements NestMiddleware {
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
      req['filter'] =
        Object.keys(req.body).length === 0 &&
        Object.keys(req.query).length === 0
          ? {}
          : () => {
              const method =
                Object.keys(req.body).length !== 0 ? 'body' : 'query';
              const request = {
                filter:
                  typeof req[method].filter === 'string'
                    ? JSON.parse(req[method].filter)
                    : req[method].filter,
                order:
                  typeof req[method].order === 'string'
                    ? JSON.parse(req[method].order)
                    : req[method].order,
                limit:
                  typeof req[method].limit === 'string'
                    ? JSON.parse(req[method].limit)
                    : req[method].limit,
                offset:
                  typeof req[method].offset === 'string'
                    ? JSON.parse(req[method].offset)
                    : req[method].offset,
              };
              const search = new SearchBuilder(this.sequelize, request)
                .setConfig({ 'default-limit': false })
                .getFullQuery();
              const filter = Object.fromEntries(
                Object.entries(search).filter(
                  ([_, v]) => v !== null && v !== undefined,
                ),
              );

              return filter;
            };
    } catch (e) {
      req['filter'] = {};
    }
    next();
  }
}
