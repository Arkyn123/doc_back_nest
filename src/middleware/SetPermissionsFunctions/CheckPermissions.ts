import errors from 'src/utils/errors';

const hasCommons = (array1, array2): Boolean => {
  for (const el1 of array1) {
    for (const el2 of array2) {
      if (el1.role == el2.idAccessCode) {
        return true;
      }
    }
  }
  return false;
};

export default async function checkPermissions(req, res) {
  if (!req.permissions.authenticated) return;

  if (req.permissions.roles.length !== 0) {
    req.permissions.rolePassed = hasCommons(
      req.permissions.roles,
      req.user.roles,
    );
    req.officeCheckWanted = !req.permissions.roles.some(
      (r) => r.officeCheck === false,
    );
    req.permissions.roleWanted = true;
    req.permissions.fieldWanted = req.permissions.field !== undefined;
  } else if (req.permissions.field === undefined) {
    req.permissions.rolePassed = hasCommons(req.permissions.roles, req.roles);
    req.officeCheckWanted = !req.permissions.roles.some(
      (r) => r.officeCheck === false,
    );
    if (!req.permissions.rolePassed) {
      return res.sendStatus(errors.forbidden.code);
    } else {
      req.permissions.roleWanted = true;
      req.permissions.fieldWanted = false;
      return;
    }
  } else {
    req.permissions.fieldWanted = true;
    req.permissions.roleWanted = false;
    return;
  }
}
