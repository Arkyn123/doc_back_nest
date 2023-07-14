import { Injectable } from '@nestjs/common';
import { Request } from 'express';
@Injectable()
export class UserService {
  getUser(req: Request) {
    console.log(req.body)
    return;

    // const user = req.user;

    // const roles = req.roles;

    // const officeId = req.officeId;
    // // console.log({
    // //   user,
    // //   roles,
    // //   officeId,
    // // });

    // return {
    //   user,
    //   roles,
    //   officeId,
    // };
  }
}
