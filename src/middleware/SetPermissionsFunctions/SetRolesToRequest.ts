import { config } from 'src/utils/config';
import errors from 'src/utils/errors';
import fetch from 'node-fetch';

export default async function setRolesToRequest(req, res) {
  if (!req.permissions.authenticated) return;

  if (!req.user) return res.sendStatus(errors.unauthorized.code);

  try {
    const response = await fetch(config[process.env.NODE_ENV].services.users, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${req.user.token}`,
      },
      body: JSON.stringify({
        query: `query {
                  Workers(employeeNumber: ${req.user.id}) {
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
    });

    const { permissions, positions } = (await response.json()).data.Workers[0];
    const roles = permissions;
    const { office } = positions[0];

    const adminUser = [184184];

    if (adminUser.includes(req.user.id)) {
      roles.push(
        { idAccessCode: 'UEMI_ADMIN', idOffice: null },
        { idAccessCode: 'admin', idOffice: null },
      );
    }

    if (roles.some((role) => role.idAccessCode == 'UEMI_ADMIN')) {
      roles.push(
        { idAccessCode: 'SDM_SECRETARY_CHECK', idOffice: null },
        { idAccessCode: 'SDM_LABOR_CHECK', idOffice: null },
        { idAccessCode: 'SDM_SECRETARY_REGISTRATION', idOffice: null },
        { idAccessCode: 'SDM_LABOR_REGISTRATION', idOffice: null },
      );
    }

    const uniqueRoles = roles.filter(
      (obj, index, self) =>
        index ===
        self.findIndex(
          (o) =>
            o.idAccessCode === obj.idAccessCode && o.idOffice === obj.idOffice,
        ),
    );

    req.user.roles = uniqueRoles;
    req.user.officeId = office.id;
    req.user.officeName = office.name;

    // ===> CheckPermissions
  } catch (e) {
    console.warn(e);
    return res.sendStatus(errors.badRequest.code);
  }
}
