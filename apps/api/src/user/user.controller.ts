import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from '@bookhelper/shared';
import { CurrentUser } from '../auth/current-user.decorator';
import type {MongoId} from "../common/mongo-id-type";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async me(@CurrentUser() userId: MongoId): Promise<UserDto> {
    return this.userService.findById(userId);
  }
}
