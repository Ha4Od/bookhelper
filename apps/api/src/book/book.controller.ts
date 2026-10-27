import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './create-book.dto';
import { BookDocument } from './book.schema';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  async create(
    @Body(new ValidationPipe({ whitelist: true })) createBookDto: CreateBookDto,
  ): Promise<BookDocument> {
    return this.bookService.create(createBookDto);
  }
}
