import {Injectable, NotFoundException} from '@nestjs/common';
import { User, UserDocument } from './user.schema';
import {Model, Types} from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import argon2 from 'argon2';
import { UserDto } from '@bookhelper/shared';
import { toUserDto } from './user.mapper';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(dto: CreateUserDto): Promise<UserDto> {
    const { password, ...rest } = dto;
    const passwordHash: string = await argon2.hash(password);
    const tempUser = { ...rest, passwordHash };
    const getUserCreate = await this.userModel.create(tempUser);
    return toUserDto(getUserCreate);
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email });
  }

  async findById(id: string): Promise<UserDto> {
    return toUserDto(await this.userModel.findById(id).orFail(new NotFoundException("Not Found")));
  }
}
