import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chapter, ChapterDocument } from './chapter.schema';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { OnEvent } from '@nestjs/event-emitter';
import { BOOK_DELETED } from '../book/book.events';
import { toChapterDto } from './chapter.mapper';
import { ChapterDto } from '@bookhelper/shared';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import {BookService} from "../book/book.service";
import type {MongoId} from "../common/mongo-id-type";

@Injectable()
export class ChapterService {
  constructor(
    @InjectModel(Chapter.name)
    private readonly chapterModel: Model<ChapterDocument>,
    private readonly bookService: BookService,
  ) {}


  async create(dto: CreateChapterDto, userId: MongoId): Promise<ChapterDto> {
    await this.bookService.findById(dto.bookId, userId);
    return toChapterDto(await this.chapterModel.create(dto));
  }

  async findByBookId(bookId: MongoId, userId: MongoId): Promise<ChapterDto[]> {
    await this.bookService.findById(bookId, userId);
    const chapters = await this.chapterModel
      .find({ bookId })
      .sort({ order: 1 });
    return chapters.map((chapter) => toChapterDto(chapter));
  }

  async findById(id: MongoId, userId: MongoId): Promise<ChapterDto> {
    return toChapterDto(
      await this.chapterModel
        .findOne({_id: id, userId: userId})
        .orFail(new NotFoundException('Chapter Not Found')),
    );
  }

  async update(id: MongoId, dto: UpdateChapterDto, userId: MongoId): Promise<ChapterDto> {
    return toChapterDto(
      await this.chapterModel
        .findOneAndUpdate({_id: id, userId: userId}, dto, {
          returnDocument: 'after',
          runValidators: true,
        })
        .orFail(new NotFoundException('Chapter not found')),
    );
  }

  async delete(id: MongoId, userId: MongoId): Promise<void> {
    await this.chapterModel
      .findOneAndDelete({_id: id, userId: userId})
      .orFail(new NotFoundException('Chapter not found'));
  }

  @OnEvent(BOOK_DELETED, { suppressErrors: false })
  async onBookDeleted(bookId: MongoId): Promise<void> {
    await this.chapterModel.deleteMany({ bookId });
  }
}
