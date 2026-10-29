import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import argon2 from 'argon2';
import {UserDto} from "@bookhelper/shared";
import {toUserDto} from "./user.mapper";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(dto: CreateUserDto): Promise<UserDto> {
    const { password, ...rest} = dto;
    const passwordHash: string  = await argon2.hash(password);
    const tempUser = { ...rest, passwordHash }
    const getUserCreate = await this.userModel.create(tempUser);
    return toUserDto(getUserCreate);
  }
}

