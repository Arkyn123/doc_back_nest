import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import setWantedPermission from './SetPermissionsFunctions/SetWantedPermission';
import setUserToRequest from './SetPermissionsFunctions/SetUserToRequest';
import setRolesToRequest from './SetPermissionsFunctions/setRolesToRequest';
import checkPermissions from './SetPermissionsFunctions/checkPermissions';

@Injectable()
export class setPermissions implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    await setWantedPermission(req);
    await setUserToRequest(req, res);
    await setRolesToRequest(req, res);
    await checkPermissions(req, res);
    next();
  }
}
