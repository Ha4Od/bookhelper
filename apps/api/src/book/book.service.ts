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

  async findById(id: Types.ObjectId, userId:string): Promise<BookDto> {
    const book = await this.bookModel
      .findOne({
        _id: id,
        userId,
      })
        .orFail(new NotFoundException('Book not found'));
    return toBookDto(book);
  }

  async findAllByUserId(userId: string): Promise<BookDto[]> {
    const books: BookDocument[] = await this.bookModel.find({ userId });
    return books.map((book) => toBookDto(book));
  }


  async update(
    id: Types.ObjectId,
    dto: UpdateBookTitleDto,
    userId: string,
  ): Promise<BookDto> {

      return toBookDto(
        await this.bookModel
          .findOneAndUpdate({_id: id, userId}, dto, {
            returnDocument: 'after',
            runValidators: true,
          })
          .orFail(new NotFoundException('Book not found')),
      );
  }

  async delete(id: Types.ObjectId, userId: string): Promise<void> {
      await this.bookModel
        .findOneAndDelete({_id: id, userId})
        .orFail(new NotFoundException('Book not found'));
      await this.eventEmitter.emitAsync(BOOK_DELETED, id);
  }
}
