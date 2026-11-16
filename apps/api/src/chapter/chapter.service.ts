import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chapter, ChapterDocument } from './chapter.schema';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { OnEvent } from '@nestjs/event-emitter';
import { BOOK_DELETED } from '../book/book.events';
import { toChapterDto } from './chapter.mapper';
import { ChapterDto, ChapterListItemDto } from '@bookhelper/shared';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { BookService } from '../book/book.service';
import type { MongoId } from '../common/mongo-id-type';
import { countWords } from '../common/word-count';
import { NOT_FOUND } from '../common/not-found-error';
import { toChapterFrontDto } from './chapter.list-item.mapper';

@Injectable()
export class ChapterService {
  constructor(
    @InjectModel(Chapter.name)
    private readonly chapterModel: Model<ChapterDocument>,
    private readonly bookService: BookService,
  ) {}

  async getChapterSumByBookId(bookId: MongoId): Promise<void> {
    await this.chapterModel.aggregate([
      { $match: { bookId: bookId } },
      {
        $group: {
          wordCount: { $sum: '$wordCount' },

        },
      },
    ]);
  }

  async create(dto: CreateChapterDto, userId: MongoId): Promise<ChapterDto> {
    const { title, bookId, text, order } = dto;
    await this.bookService.findById(dto.bookId, userId);
    return toChapterDto(
      await this.chapterModel.create({
        title,
        bookId,
        text,
        order,
        wordCount: countWords(text ?? ''),
      }),
    );
  }

  async findByBookId(
    bookId: MongoId,
    userId: MongoId,
  ): Promise<ChapterListItemDto[]> {
    await this.bookService.findById(bookId, userId);
    const chapters = await this.chapterModel
      .find({ bookId })
      .sort({ order: 1 })
      .select('title bookId order wordCount');
    return chapters.map((chapter) => toChapterFrontDto(chapter));
  }

  async findById(id: MongoId, userId: MongoId): Promise<ChapterDto> {
    return toChapterDto(await this.getChapterDocument(id, userId));
  }

  private async getChapterDocument(
    id: MongoId,
    userId: MongoId,
  ): Promise<ChapterDocument> {
    const chapter = await this.chapterModel
      .findById(id)
      .orFail(new NotFoundException(NOT_FOUND));
    await this.bookService.findById(chapter.bookId, userId);
    return chapter;
  }

  async update(
    id: MongoId,
    dto: UpdateChapterDto,
    userId: MongoId,
  ): Promise<ChapterDto> {
    await this.getChapterDocument(id, userId);
    const { title, order, text } = dto;
    let wordCount: number | undefined;
    if (text !== undefined) {
      wordCount = countWords(text);
    }
    return toChapterDto(
      await this.chapterModel
        .findByIdAndUpdate(
          id,
          {
            title,
            order,
            text,
            wordCount: wordCount,
          },
          {
            returnDocument: 'after',
            runValidators: true,
          },
        )
        .orFail(new NotFoundException(NOT_FOUND)),
    );
  }

  async delete(id: MongoId, userId: MongoId): Promise<void> {
    await this.getChapterDocument(id, userId);
    await this.chapterModel
      .findByIdAndDelete(id)
      .orFail(new NotFoundException(NOT_FOUND));
  }

  @OnEvent(BOOK_DELETED, { suppressErrors: false })
  async onBookDeleted(bookId: MongoId): Promise<void> {
    await this.chapterModel.deleteMany({ bookId });
  }
}
