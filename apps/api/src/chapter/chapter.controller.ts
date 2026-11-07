import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { ChapterDocument } from './chapter.schema';
import {ChapterDto} from "@bookhelper/shared";
import {Types} from "mongoose";
import {ParseObjectIdPipe} from "@nestjs/mongoose";
import {UpdateChapterDto} from "./dto/update-chapter.dto";

@Controller('chapter')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  @Post()
  async create(@Body() dto: CreateChapterDto): Promise<ChapterDto> {
    return this.chapterService.create(dto);
  }

  @Get(":id")
  async find(@Param('id', ParseObjectIdPipe) id: Types.ObjectId): Promise<ChapterDto> {
    return this.chapterService.findById(id)
  }

  @Get()
  async findByBookId(@Query('bookId', ParseObjectIdPipe) id: Types.ObjectId): Promise<ChapterDto[]> {
    return this.chapterService.findByBookId(id);
  }

  @Patch(":id")
  async update(@Param('id', ParseObjectIdPipe) id: Types.ObjectId, @Body() dto: UpdateChapterDto): Promise<ChapterDto> {
    return this.chapterService.update(id, dto);
  }

  @Delete(":id")
  async delete(@Param('id', ParseObjectIdPipe) id: Types.ObjectId): Promise<void> {
    await this.chapterService.delete(id);
  }
}
