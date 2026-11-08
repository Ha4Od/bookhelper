import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { CreateBookDto } from './dto/create-book.dto';
import { Book, BookDocument } from './book.schema';
import { InjectModel } from '@nestjs/mongoose';
import { BookDto } from '@bookhelper/shared';
import { toBookDto } from './book.mapper';
import { UpdateBookTitleDto } from './dto/update-booktitle.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BOOK_DELETED } from './book.events';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name) private readonly bookModel: Model<BookDocument>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(dto: CreateBookDto): Promise<BookDto> {
    return toBookDto(await this.bookModel.create(dto));
  }

  async findById(id: Types.ObjectId): Promise<BookDto> {
    const book = await this.bookModel
      .findById(id)
      .orFail(new NotFoundException('Book not found'));
    return toBookDto(book);
  }

  async findAllByUserId(userId: Types.ObjectId): Promise<BookDto[]> {
    const books: BookDocument[] = await this.bookModel.find({ userId });
    return books.map((book) => toBookDto(book));
  }

  async update(id: Types.ObjectId, dto: UpdateBookTitleDto): Promise<BookDto> {
    return toBookDto(
      await this.bookModel
        .findByIdAndUpdate(id, dto, {
          returnDocument: 'after',
          runValidators: true,
        })
        .orFail(new NotFoundException('Book not found')),
    );
  }

  async delete(id: Types.ObjectId): Promise<void> {
    await this.bookModel
      .findByIdAndDelete(id)
      .orFail(new NotFoundException('Book not found'));
    await this.eventEmitter.emitAsync(BOOK_DELETED, id);
  }
}
