import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Character, CharacterDocument } from './character.schema';
import { CreateCharacterDto } from './dto/create-character.dto';
import { OnEvent } from '@nestjs/event-emitter';
import { BOOK_DELETED } from '../book/book.events';
import { CharacterDto } from '@bookhelper/shared';
import { toCharacterDto } from './character.mapper';
import { UpdateCharacterDto } from './dto/update-character.dto';

@Injectable()
export class CharacterService {
  constructor(
    @InjectModel(Character.name)
    private readonly characterModel: Model<CharacterDocument>,
  ) {}

  async create(dto: CreateCharacterDto): Promise<CharacterDto> {
    return toCharacterDto(await this.characterModel.create(dto));
  }

  async findById(id: Types.ObjectId): Promise<CharacterDto> {
    return toCharacterDto(
      await this.characterModel
        .findById(id)
        .orFail(new NotFoundException('Character Not Found')),
    );
  }

  async findByBookId(bookId: Types.ObjectId): Promise<CharacterDto[]> {
    const characters = await this.characterModel
      .find({ bookId })
      .sort({ name: 1 });
    return characters.map((character) => toCharacterDto(character));
  }

  async update(
    id: Types.ObjectId,
    dto: UpdateCharacterDto,
  ): Promise<CharacterDto> {
    return toCharacterDto(
      await this.characterModel
        .findByIdAndUpdate(id, dto, {
          returnDocument: 'after',
          runValidators: true,
        })
        .orFail(new NotFoundException('Character not found')),
    );
  }

  async delete(id: Types.ObjectId): Promise<void> {
    await this.characterModel
      .findByIdAndDelete(id)
      .orFail(new NotFoundException('Character not found'));
  }

  @OnEvent(BOOK_DELETED, { suppressErrors: false })
  async onBookDeleted(bookId: Types.ObjectId): Promise<void> {
    await this.characterModel.deleteMany({ bookId });
  }
}
