import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { BookDto } from '@bookhelper/shared';
import { Types } from 'mongoose';
import { UpdateBookTitleDto } from './dto/update-booktitle.dto';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  async create(
    @Body() createBookDto: CreateBookDto,
    @CurrentUser() userId: string,
  ): Promise<BookDto> {
    return this.bookService.create(createBookDto, userId);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @CurrentUser() userId: string,
  ): Promise<BookDto | null> {
    return this.bookService.findById(id, userId);
  }

  @Get()
  async findAllByUserId(@CurrentUser() userId: string): Promise<BookDto[]> {
    return this.bookService.findAllByUserId(userId);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() dto: UpdateBookTitleDto,
    @CurrentUser() userId: string,
  ): Promise<BookDto> {
    return this.bookService.update(id, dto, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @CurrentUser() userId: string,
  ): Promise<void> {
    await this.bookService.delete(id, userId);
  }
}
