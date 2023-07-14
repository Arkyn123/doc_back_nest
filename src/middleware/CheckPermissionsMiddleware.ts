import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import errors from 'src/utils/errors';

const hasCommons = (array1, array2) => {
  for (const el1 of array1) {
    for (const el2 of array2) {
      if (el1.role == el2.idAccessCode) return true;
    }
  }
  return false;
};

@Injectable()
export class checkPermissions implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    if (!req['permissions'].authenticated) {
      return next();
    }

    return req['permissions'].roles.length != 0 &&
      req['permissions'].field !== undefined
      ? ((req['permissions'].rolePassed = hasCommons(
          req['permissions'].roles,
          req['roles'],
        )),
        (req['officeCheckWanted'] = !req['permissions'].roles.some(
          (r) => r.officeCheck === false,
        )),
        (req['permissions'].roleWanted = true),
        (req['permissions'].fieldWanted = true))
      : req['permissions'].roles.length != 0 &&
        req['permissions'].field === undefined
      ? ((req['permissions'].rolePassed = hasCommons(
          req['permissions'].roles,
          req['roles'],
        )),
        (req['officeCheckWanted'] = !req['permissions'].roles.some(
          (r) => r.officeCheck === false,
        )),
        !req['permissions'].rolePassed
          ? res.sendStatus(errors.forbidden.code)
          : ((req['permissions'].roleWanted = true),
            (req['permissions'].fieldWanted = false),
            next()))
      : ((req['permissions'].fieldWanted =
          req['permissions'].field === undefined ? false : true),
        (req['permissions'].roleWanted = false),
        next());
  }
}
