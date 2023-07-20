import errors from 'src/utils/errors';

const hasCommons = (array1, array2) => {
  const accessCodeSet = new Set(array2.map((el) => el.idAccessCode));
  for (const el1 of array1) {
    if (accessCodeSet.has(el1.role)) {
      return true;
    }
  }
  return false;
};

export default async function checkPermissions(req, res) {
  if (!req.permissions.authenticated) return;

  if (req.permissions.roles.length !== 0) {
    const rolePassed = hasCommons(req.permissions.roles, req.user.roles);

    const officeCheckWanted = !req.permissions.roles.some(
      (r) => r.officeCheck === false,
    );

    req.permissions.rolePassed = rolePassed;
    req.permissions.roleWanted = true;
    req.permissions.fieldWanted = req.permissions.field !== undefined;

    if (req.permissions.fieldWanted) {
      req.officeCheckWanted = officeCheckWanted;
    } else if (!rolePassed) {
      return res.sendStatus(errors.forbidden.code);
    }
  } else {
    req.permissions.roleWanted = false;
    req.permissions.fieldWanted = req.permissions.field !== undefined;
  }
}
