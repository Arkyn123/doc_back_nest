import { Injectable, NestMiddleware, Req } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { config } from 'src/utils/config';
import errors from 'src/utils/errors';
import fetch from 'node-fetch';

//Форматирование имени (ИВАНОВ ИВАН ИВАНОВИЧ => Иванов Иван Иванович)
const camelCase = (rawWord: string): string => {
  return rawWord
    .trim()
    .split(' ')
    .map((w) => w.toLowerCase())
    .map((w) => (w = w[0].toUpperCase() + w.substring(1)))
    .join(' ');
};

@Injectable()
export class setUserToRequest implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    return !req['permissions'].authenticated
      ? next()
      : !req.headers.authorization
      ? res.sendStatus(errors.unauthorized.code)
      : (async () => {
          try {
            const response = await fetch(
              config[process.env.NODE_ENV].services.gatewayDecode,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  token: req.headers.authorization.split(' ')[1],
                }),
              },
            );

            const userFromService = await response.json();
            const user = {
              id: parseInt(userFromService.emp, 10),
              fullname: camelCase(userFromService.FIO),
            };
            req['user'] = user;
            req['token'] = req.headers.authorization.split(' ')[1];
            next();
          } catch (error) {
            return res.sendStatus(errors.badRequest.code);
          }
        })();
  }
}
