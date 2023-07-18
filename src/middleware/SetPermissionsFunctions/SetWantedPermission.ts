import { config } from '../../utils/config';

const getRouterPermissions = (path) => {
  var permissions = require('../../utils/permissions');

  path.forEach((item) => {
    permissions = permissions[item];
  });
  return permissions;
};

export default async function setWantedPermission(req) {
  let url = req['originalUrl'];
  let parts = url.split('/');
  url = parts.slice(0, 2).join('/');

  const routerPath = [
    config[process.env.NODE_ENV].server.urlPrefix,
    ...url.split('/').filter((item) => item !== '' && isNaN(item)),
  ];

  let path = req.route.path;
  path = path.replace(/\*/g, '');

  routerPath.forEach((item) => {
    const regex = new RegExp(`/${item}`, 'g');
    path = path.replace(regex, '');
  });

  if (path == '') path = '/';
  console.log(routerPath, path);

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
