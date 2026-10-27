import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateBookDto } from './dto/create-book.dto';
import { Book, BookDocument } from './book.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name) private readonly bookModel: Model<BookDocument>,
  ) {}

  async create(dto: CreateBookDto): Promise<BookDocument> {
    return this.bookModel.create(dto);
  }

  // async findById(id: string): Promise<BookDocument> {
  // }
}
