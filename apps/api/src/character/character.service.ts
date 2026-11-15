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
import { MongoId } from '../common/mongo-id-type';
import { BookService } from '../book/book.service';

@Injectable()
export class CharacterService {
  constructor(
    @InjectModel(Character.name)
    private readonly characterModel: Model<CharacterDocument>,
    private readonly bookService: BookService,
  ) {}

  private async getCharacterDocument(
    id: MongoId,
    userId: MongoId,
  ): Promise<CharacterDocument> {
    const character = await this.characterModel
      .findById(id)
      .orFail(new NotFoundException('Not Found'));
    await this.bookService.findById(character.bookId, userId);
    return character;
  }

  async create(
    dto: CreateCharacterDto,
    userId: MongoId,
  ): Promise<CharacterDto> {
    await this.bookService.findById(dto.bookId, userId);
    return toCharacterDto(await this.characterModel.create(dto));
  }

  async findById(id: MongoId, userId: MongoId): Promise<CharacterDto> {
    return toCharacterDto(await this.getCharacterDocument(id, userId));
  }

  async findByBookId(
    bookId: MongoId,
    userId: MongoId,
  ): Promise<CharacterDto[]> {
    await this.bookService.findById(bookId, userId);
    const characters = await this.characterModel
      .find({ bookId })
      .sort({ name: 1 });
    return characters.map((character) => toCharacterDto(character));
  }

  async update(
    id: MongoId,
    dto: UpdateCharacterDto,
    userId: MongoId,
  ): Promise<CharacterDto> {
    await this.getCharacterDocument(id, userId);
    return toCharacterDto(
      await this.characterModel
        .findByIdAndUpdate(id, dto, {
          returnDocument: 'after',
          runValidators: true,
        })
        .orFail(new NotFoundException('Not found')),
    );
  }

  async delete(id: MongoId, userId: MongoId): Promise<void> {
    await this.getCharacterDocument(id, userId);
    await this.characterModel
      .findByIdAndDelete(id)
      .orFail(new NotFoundException('Not found'));
  }

  @OnEvent(BOOK_DELETED, { suppressErrors: false })
  async onBookDeleted(bookId: Types.ObjectId): Promise<void> {
    await this.characterModel.deleteMany({ bookId });
  }
}
