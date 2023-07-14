import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class MyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    console.log('\n User');
    console.log(req['user'].roles);
    console.log('\n Permissions');
    console.log(req['permissions']);
    console.log('\n');

    return true;
  }
}
