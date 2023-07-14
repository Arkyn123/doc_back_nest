import { config } from 'src/utils/config';
import errors from 'src/utils/errors';
import fetch from 'node-fetch';

export default async function setRolesToRequest(req, res) {
  return !req['permissions'].authenticated
    ? null
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
          let roles = userDataFromGraphQL.Workers[0].permissions;
          const office = userDataFromGraphQL.Workers[0].positions[0].office;

          const adminUser = [184184];

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

          if (adminUser.includes(req['user'].id)) {
            roles.push({ idAccessCode: 'admin', idOffice: null });
          }

          roles = roles.filter(
            (obj, index, self) =>
              index ===
              self.findIndex(
                (o) =>
                  o.idAccessCode === obj.idAccessCode &&
                  o.idOffice === obj.idOffice,
              ),
          );

          req['user'].roles = roles;
          req['user'].officeId = office.id;
          req['user'].officeName = office.name;
          // ===> CheckPermissions
        } catch (error) {
          return res.sendStatus(errors.badRequest.code);
        }
      })();
}
