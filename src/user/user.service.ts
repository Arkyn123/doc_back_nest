import { Injectable } from '@nestjs/common';
import errors from 'src/utils/errors';

@Injectable()
export class UserService {
  async getUser(user, res) {
    return res.status(errors.success.code).json({
      user: user,
      roles: user.roles,
      officeId: user.officeId,
    });
  }
}
