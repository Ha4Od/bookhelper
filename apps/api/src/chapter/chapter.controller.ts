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
  Query,
} from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { ChapterDto } from '@bookhelper/shared';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import {CurrentUser} from "../auth/current-user.decorator";
import type {MongoId} from "../common/mongo-id-type";

@Controller('chapter')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  @Post()
  async create(@Body() dto: CreateChapterDto,
               @CurrentUser() userId: MongoId): Promise<ChapterDto> {
    return this.chapterService.create(dto, userId);
  }

  @Get(':id')
  async find(
    @Param('id', ParseObjectIdPipe) id: MongoId,
    @CurrentUser() userId: MongoId
  ): Promise<ChapterDto> {
    return this.chapterService.findById(id, userId);
  }

  @Get()
  async findByBookId(
    @Query('bookId', ParseObjectIdPipe,) id: MongoId,
    @CurrentUser() userId: MongoId,
  ): Promise<ChapterDto[]> {
    return this.chapterService.findByBookId(id, userId);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseObjectIdPipe) id: MongoId,
    @Body() dto: UpdateChapterDto,
    @CurrentUser() userId: MongoId,
  ): Promise<ChapterDto> {
    return this.chapterService.update(id, dto, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id', ParseObjectIdPipe) id: MongoId,
    @CurrentUser() userId: MongoId,
  ): Promise<void> {
    await this.chapterService.delete(id, userId);
  }
}
