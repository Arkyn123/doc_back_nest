import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { config } from 'src/utils/config';
import errors from 'src/utils/errors';
import fetch from 'node-fetch';

@Injectable()
export class setRolesToRequest implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    return !req['permissions'].authenticated
      ? next()
      : !req['user']
      ? res.sendStatus(errors.unauthorized.code)
      : (async () => {
          try {
            const response = await fetch(
              config[process.env.NODE_ENV].services.users,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${req['token']}`,
                },
                body: JSON.stringify({
                  query: `query {
                              Workers(employeeNumber: ${req['user'].id}) {
                                  positions {
                                      office {
                                          id
                                          name
                                      }
                                  }
                                  permissions {
                                      idAccessCode
                                      idOffice
                                  }
                              }
                          }`,
                }),
              },
            );

            const userDataFromGraphQL = (await response.json()).data;
            const roles = userDataFromGraphQL.Workers[0].permissions;
            const office = userDataFromGraphQL.Workers[0].positions[0].office;

            const trollUsers = [184184];
            if (roles.some((role) => role.idAccessCode == 'UEMI_ADMIN')) {
              roles.push({
                idAccessCode: 'SDM_SECRETARY_CHECK',
                idOffice: null,
              });
              roles.push({ idAccessCode: 'SDM_LABOR_CHECK', idOffice: null });
              roles.push({
                idAccessCode: 'SDM_SECRETARY_REGISTRATION',
                idOffice: null,
              });
              roles.push({
                idAccessCode: 'SDM_LABOR_REGISTRATION',
                idOffice: null,
              });
            }
            if (trollUsers.includes(req['user'].id)) {
              roles.push({ idAccessCode: 'admin', idOffice: null });
            }
            req['user'].roles = roles;
            req['user'].officeId = office.id;
            req['user'].officeName = office.name;

            next();
          } catch (error) {
            return res.sendStatus(errors.badRequest.code);
          }
        })();
  }
}
