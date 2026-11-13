import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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

  async create(dto: CreateBookDto, userId: string): Promise<BookDto> {
    return toBookDto(
      await this.bookModel.create({
        userId: userId,
        title: dto.title,
      }),
    );
  }

  async findById(id: Types.ObjectId): Promise<BookDto> {
    const book = await this.bookModel
      .findById(id)
      .orFail(new NotFoundException('Book not found'));
    return toBookDto(book);
  }

  async findAllByUserId(userId: string): Promise<BookDto[]> {
    const books: BookDocument[] = await this.bookModel.find({ userId });
    return books.map((book) => toBookDto(book));
  }

  private checkUserAttachment(book: BookDto, userId: string): boolean {
    return book.userId === userId;
  }

  async update(
    id: Types.ObjectId,
    dto: UpdateBookTitleDto,
    userId: string,
  ): Promise<BookDto> {
    const book = await this.findById(id);
    if (this.checkUserAttachment(book, userId)) {
      return toBookDto(
        await this.bookModel
          .findByIdAndUpdate(id, dto, {
            returnDocument: 'after',
            runValidators: true,
          })
          .orFail(new NotFoundException('Book not found')),
      );
    } else throw new UnauthorizedException('Permission denied!');
  }

  async delete(id: Types.ObjectId, userId: string): Promise<void> {
    const book = await this.findById(id);
    if (this.checkUserAttachment(book, userId)) {
      await this.bookModel
        .findByIdAndDelete(id)
        .orFail(new NotFoundException('Book not found'));
      await this.eventEmitter.emitAsync(BOOK_DELETED, id);
    } else throw new UnauthorizedException('Permission denied!');
  }
}
