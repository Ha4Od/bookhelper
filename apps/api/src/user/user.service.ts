import { Injectable } from '@nestjs/common';
import {User, UserDocument} from './user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(dto: CreateUserDto): Promise<UserDocument> {
    const { name, email, password, nickname } = dto;
    const passwordHash = await argon2.hash(password);
    return this.userModel.create({ name, email, passwordHash, nickname });
  }
}
