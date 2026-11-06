import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {Model, Types} from 'mongoose';
import { Chapter, ChapterDocument } from './chapter.schema';
import { CreateChapterDto } from './dto/create-chapter.dto';
import {OnEvent} from "@nestjs/event-emitter";

@Injectable()
export class ChapterService {
  constructor(
    @InjectModel(Chapter.name)
    private readonly chapterModel: Model<ChapterDocument>,
  ) {}

  async create(dto: CreateChapterDto): Promise<ChapterDocument> {
    return this.chapterModel.create(dto);
  }

  @OnEvent('book.deleted', { suppressErrors: false })
  async onBookDeleted(bookId: Types.ObjectId): Promise<void> {
    await this.chapterModel.deleteMany({ bookId });
  }
}
