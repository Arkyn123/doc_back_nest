import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Request, Response } from 'express';
import { Document } from '../document/document.model';

@Injectable()
export class PermGuard implements CanActivate {
  constructor(
    @InjectModel(Document)
    private readonly documentRepository: typeof Document,
  ) {}

  //OwnerOrHasPermissions
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    const documentId = req.params.documentId;

    const userRoles = req['user'].roles;

    if (!documentId) {
      console.warn('Не найден документ в PermGuard');
      return false;
    }

    // if (userRoles.some((item) => item.idAccessCode === 'admin'))
    //   return true;

    if (!req['permissions'].authenticated) {
      return true;
    }

    const { roleWanted, fieldWanted, rolePassed, field } = req['permissions'];

    if (!roleWanted && !fieldWanted) {
      return true;
    }

    if (roleWanted && rolePassed) {
      if (fieldWanted || req['permissions'].officeCheckWanted) {
        const userField = field[0];
        const fieldValue = req['user'][userField];
        const object = await this.documentRepository.findByPk(documentId);

        return (
          (object['_options'].attributes.includes(userField) &&
            object[userField] === fieldValue) ||
          userRoles.some((r) => r.idOffice === object.officeId) ||
          !object['_options'].attributes.includes(userField)
        );
      }

      return true;
    }

    if (fieldWanted) {
      const userField = field[0];
      const fieldValue = req['user'][userField];
      const object = await this.documentRepository.findByPk(documentId);

      return (
        !object['_options'].attributes.includes(userField) ||
        object[userField] === fieldValue
      );
    }

    return false;
  }
}
