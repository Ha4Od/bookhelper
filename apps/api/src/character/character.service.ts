import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {Model, Types} from 'mongoose';
import { Character, CharacterDocument } from './character.schema';
import { CreateCharacterDto } from './dto/create-character.dto';
import {OnEvent} from "@nestjs/event-emitter";

@Injectable()
export class CharacterService {
  constructor(
    @InjectModel(Character.name)
    private readonly characterModel: Model<CharacterDocument>,
  ) {}

  async create(dto: CreateCharacterDto): Promise<CharacterDocument> {
    return this.characterModel.create(dto);
  }

  @OnEvent('book.deleted', { suppressErrors: false })
  async onBookDeleted(bookId: Types.ObjectId): Promise<void> {
    await this.characterModel.deleteMany({ bookId });
  }
}
