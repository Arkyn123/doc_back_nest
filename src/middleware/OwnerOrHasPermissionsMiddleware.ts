import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ownerOrHasPermissions implements NestMiddleware {
  async use(req: Request, object: Object) {
    if (req['permissions'].authenticated) {
      if (!req['permissions'].roleWanted && !req['permissions'].fieldWanted) {
        return true;
      }

      if (
        req['permissions'].roleWanted &&
        req['permissions'].rolePassed &&
        (req['permissions'].fieldWanted ||
          req['permissions'].officeCheckWanted) &&
        ((Object.entries(req['permissions'].field)[0] &&
          object['_options'].attributes.includes(
            Object.entries(req['permissions'].field)[0][0],
          ) &&
          object[Object.entries(req['permissions'].field)[0][0]] ==
            req['user'][Object.entries(req['permissions'].field)[0][1]]) ||
          req['roles']
            .map((r) => r.idOffice)
            .some((r) => r == object['officeId']))
      ) {
        return true;
      }

      if (
        req['permissions'].fieldWanted &&
        Object.entries(req['permissions'].field)[0] &&
        object['_options'].attributes.includes(
          Object.entries(req['permissions'].field)[0][0],
        ) &&
        object[Object.entries(req['permissions'].field)[0][0]] ==
          req['user'][Object.entries(req['permissions'].field)[0][1]]
      ) {
        return true;
      }

      if (
        req['permissions'].fieldWanted &&
        Object.entries(req['permissions'].field)[0] &&
        !object['_options'].attributes.includes(
          Object.entries(req['permissions'].field)[0][0],
        )
      ) {
        return true;
      }

      return false;
    } else {
      return true;
    }
  }
}
