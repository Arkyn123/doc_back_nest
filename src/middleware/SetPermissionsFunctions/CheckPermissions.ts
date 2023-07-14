import errors from 'src/utils/errors';

const hasCommons = (array1, array2) => {
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
  if (!req['permissions'].authenticated) {
    return null;
  }

  return req['permissions'].roles.length != 0 &&
    req['permissions'].field !== undefined
    ? ((req['permissions'].rolePassed = hasCommons(
        req['permissions'].roles,
        req['roles'],
      )),
      (req['officeCheckWanted'] = !req['permissions'].roles.some(
        (r) => r.officeCheck === false,
      )),
      (req['permissions'].roleWanted = true),
      (req['permissions'].fieldWanted = true))
    : req['permissions'].roles.length != 0 &&
      req['permissions'].field === undefined
    ? ((req['permissions'].rolePassed = hasCommons(
        req['permissions'].roles,
        req['roles'],
      )),
      (req['officeCheckWanted'] = !req['permissions'].roles.some(
        (r) => r.officeCheck === false,
      )),
      !req['permissions'].rolePassed
        ? res.sendStatus(errors.forbidden.code)
        : ((req['permissions'].roleWanted = true),
          (req['permissions'].fieldWanted = false)))
    : ((req['permissions'].fieldWanted =
        req['permissions'].field === undefined ? false : true),
      (req['permissions'].roleWanted = false));
}
