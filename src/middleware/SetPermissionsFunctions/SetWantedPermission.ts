import { config } from '../../utils/config';

const getRouterPermissions = (path) => {
  var permissions = require('../../utils/permissions');

  path.forEach((item) => {
    permissions = permissions[item];
  });
  return permissions;
};

export default async function setWantedPermission(req) {
  const routerPath = [
    config[process.env.NODE_ENV].server.urlPrefix,
    ...req['originalUrl'].split('/').filter((item) => item !== ''),
  ];

  let path = req['route'].path;
  path = path.replace(/\*/g, '');

  const routerPermissions = getRouterPermissions(routerPath)[path];

  const permissions = {
    roles: routerPermissions
      .filter((p) => p.role !== undefined)
      .map((p) => ({ role: p.role, officeCheck: p.officeCheck })),
    field: routerPermissions
      .filter((p) => p.field !== undefined)
      .map((p) => p.field)[0],
  };

  permissions['authenticated'] =
    !permissions.roles.length && !permissions.field;

  req['permissions'] = permissions;
  // ===> setUserToRequest
  //   next();
}