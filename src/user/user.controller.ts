import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/utils/custom.decorators';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUser(@User() user, @Res() res) {
    return this.userService.getUser(user, res);
  }
}
