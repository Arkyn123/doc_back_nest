import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Request, Response } from 'express';
import { Document } from '../document/document.model';
import errors from 'src/utils/errors';

@Injectable()
export class PermGuard implements CanActivate {
  constructor(
    @InjectModel(Document)
    private readonly documentRepository: typeof Document,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();
    let object;

    (async () => {
      object = await this.documentRepository.findByPk(req.params.documentId, {
        include: [{ all: true, nested: true, duplicating: true }],
      });
    })();
    if (!object) {
      res.sendStatus(errors.notFound.code);
      return false;
    }

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
