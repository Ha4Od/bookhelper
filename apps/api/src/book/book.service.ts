import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateBookDto } from './dto/create-book.dto';
import { Book, BookDocument } from './book.schema';
import { InjectModel } from '@nestjs/mongoose';
import { BookDto } from '@bookhelper/shared';
import { toBookDto } from './book.mapper';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name) private readonly bookModel: Model<BookDocument>,
  ) {}

  async create(dto: CreateBookDto): Promise<BookDocument> {
    return this.bookModel.create(dto);
  }

  async findById(id: string): Promise<BookDto | null> {
    const book = await this.bookModel
      .findById(id)
      .orFail(new NotFoundException('Book not found'));
    return toBookDto(book);
  }
}
