import {Body, Controller, Get, Param, Post, Query} from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { ChapterDocument } from './chapter.schema';
import {ChapterDto} from "@bookhelper/shared";
import {Types} from "mongoose";
import {ParseObjectIdPipe} from "@nestjs/mongoose";

@Controller('chapter')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  @Post()
  async create(@Body() dto: CreateChapterDto): Promise<ChapterDto> {
    return this.chapterService.create(dto);
  }

  @Get(":id")
  async find(@Param('id') id: Types.ObjectId): Promise<ChapterDto> {
    return this.chapterService.findById(id)
  }

  @Get()
  async findByBookId(@Query('bookId', ParseObjectIdPipe) id: Types.ObjectId): Promise<ChapterDto[]> {
    return this.chapterService.findByBookId(id);
  }
}
