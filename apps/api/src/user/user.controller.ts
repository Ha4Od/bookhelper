import {Body, Controller, Get, Patch} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from '@bookhelper/shared';
import { CurrentUser } from '../auth/current-user.decorator';
import {UpdateUserDto} from "./dto/update-user.dto";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async me(@CurrentUser() userId: string): Promise<UserDto> {
    return this.userService.findById(userId);
  }

  @Patch('me')
  async update(@Body() dto: UpdateUserDto,
        @CurrentUser() id: string): Promise<UserDto> {
      return this.userService.update(id, dto);
  }
}
