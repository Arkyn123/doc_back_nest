import { config } from '../../utils/config';

const getRouterPermissions = (path) => {
  let permissions = require('../../utils/permissions');

  path.forEach((item) => {
    permissions = permissions[item];
  });

  return permissions;
};

export default async function setWantedPermission(req) {
  let url = req.originalUrl;
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

  if (path === '') path = '/';
  console.log(routerPath, path);

  const routerPermissions = getRouterPermissions(routerPath)[path];

  const permissions = {};

  permissions['roles'] = routerPermissions
    .filter((p) => p.role != undefined)
    .map((p) => ({ role: p.role, officeCheck: p.officeCheck }));

  permissions['field'] = routerPermissions
    .filter((p) => p.field != undefined)
    .map((p) => p.field);

  permissions['field'] = permissions['field']?.[0] ?? undefined;

  if (permissions['roles'].length == 0 && permissions['field'] == undefined) {
    permissions['authenticated'] = routerPermissions.find(
      (p) => p.authenticated != undefined,
    );

    permissions['authenticated'] =
      permissions['authenticated']?.authenticated ?? false;
  } else {
    permissions['authenticated'] = true;
  }

  req.permissions = permissions;
  // ===> setUserToRequest
}
