import { Controller, Get, Req, UseGuards } from '@nestjs/common';
// import { PermissionsGuard } from '../filteringAndMiddleware/guards';
import { UserService } from './user.service';
import { Request } from 'express';

@Controller('users')
// @UseGuards(PermissionsGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUser(@Req() req: Request) {
    return this.userService.getUser(req);
  }
}
