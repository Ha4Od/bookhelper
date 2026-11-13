import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from '@bookhelper/shared';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async me(@CurrentUser() userId: string): Promise<UserDto> {
    return this.userService.findById(userId);
  }
}
