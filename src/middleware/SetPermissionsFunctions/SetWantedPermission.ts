import { config } from '../../utils/config';

const getRouterPermissions = (path) => {
  let permissions = require('../../utils/permissions');
  return path.reduce((acc, item) => acc[item], permissions);
};

export default async function setWantedPermission(req) {
  const url = req.originalUrl;
  const parts = url.split('/');
  const routerPath = [
    config[process.env.NODE_ENV].server.urlPrefix,
    ...parts.slice(0, 2).filter((item) => item !== '' && isNaN(item)),
  ];

  let path = req.route.path.replace(/\*/g, '');

  path = routerPath.reduce((acc, item) => {
    const regex = new RegExp(`/${item}`, 'g');
    return acc.replace(regex, '');
  }, path);

  if (path === '') path = '/';

  console.log(routerPath, path);

  const routerPermissions = getRouterPermissions(routerPath)[path];

  const permissions = {
    roles: routerPermissions
      .filter((p) => p.role !== undefined)
      .map((p) => ({ role: p.role, officeCheck: p.officeCheck })),
    field: routerPermissions.find((p) => p.field !== undefined)?.field,
  };

  const authenticatedPermission = routerPermissions.find(
    (p) => p.authenticated !== undefined,
  );
  permissions['authenticated'] = authenticatedPermission
    ? authenticatedPermission.authenticated
    : !!(permissions.roles.length || permissions.field);

  req.permissions = permissions;
  // ===> setUserToRequest
}
