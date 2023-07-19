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

  //OwnerOrHasPermissions
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    const object = await this.documentRepository.findByPk(
      req.params.documentId,
      {
        include: [{ all: true, nested: true, duplicating: true }],
      },
    );

    if (!object) {
      console.log('не найден документ в permGuard');

      return false;
    }

    if (req['user']['roles'].some((item) => item.idAccessCode === 'admin'))
      return true;

    if (req['permissions'].authenticated) {
      if (!req['permissions'].roleWanted && !req['permissions'].fieldWanted) {
        return true;
      }

      const { field } = req['permissions'];

      if (req['permissions'].roleWanted && req['permissions'].rolePassed) {
        if (
          req['permissions'].fieldWanted ||
          req['permissions'].officeCheckWanted
        ) {
          const entry = Object.entries(field)[0];
          const attributeName = entry[0];
          const userField = req['user'][entry[1]];
          return (
            (entry &&
              object['_options'].attributes.includes(attributeName) &&
              object[attributeName] === userField) ||
            req['user']['roles'].some((r) => r.idOffice == object['officeId'])
          );
        }
      }

      if (req['permissions'].fieldWanted) {
        const entry = Object.entries(field)[0];
        return (
          entry &&
          object['_options'].attributes.includes(entry[0]) &&
          object[entry[0]] === req['user'][entry[1]]
        );
      }

      return !Object.entries(field)[0];
    } else {
      return true;
    }
  }
}
