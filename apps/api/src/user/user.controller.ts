import {Controller, Get, Req} from '@nestjs/common';
import { UserService } from './user.service';
import type {AuthenticatedRequest} from "../auth/auth-request.interface"
import {UserDto} from "@bookhelper/shared";


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Get('me')
  async me(@Req()request : AuthenticatedRequest ): Promise<UserDto> {
    return this.userService.findById(request.user.userId);
  }
}