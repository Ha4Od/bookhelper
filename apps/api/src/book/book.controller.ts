import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { BookDto } from '@bookhelper/shared';
import { Types } from 'mongoose';
import {UpdateBookTitleDto} from "./dto/update-booktitle.dto";

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  async create(@Body() createBookDto: CreateBookDto): Promise<BookDto> {
    return this.bookService.create(createBookDto);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<BookDto | null> {
    return this.bookService.findById(id);
  }

  @Get()
  async findAllByUserId(@Query("userId", ParseObjectIdPipe) userId: Types.ObjectId): Promise<BookDto[]> {
    return this.bookService.findAllByUserId(userId)
  }

  @Patch(":id")
  async update(@Param('id', ParseObjectIdPipe) id: Types.ObjectId, @Body() dto: UpdateBookTitleDto): Promise<BookDto> {
    return this.bookService.update(id, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseObjectIdPipe) id: Types.ObjectId): Promise<void> {
    await this.bookService.delete(id);
  }

}
