import { Injectable } from '@nestjs/common';
import errors from 'src/utils/errors';

@Injectable()
export class UserService {
  async getUser(req, res) {
    return res.status(errors.success.code).json({
      user: req.user,
      roles: req.roles,
      officeId: req.officeId,
    });
  }
}
