import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from '@bookhelper/shared';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

}
