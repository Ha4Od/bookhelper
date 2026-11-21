import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
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
import { BookChaptersInfo } from '../book/book-chapters-info.type';

@Injectable()
export class ChapterService {
  constructor(
    @InjectModel(Chapter.name)
    private readonly chapterModel: Model<ChapterDocument>,
    private readonly bookService: BookService,
  ) {}

  private async getChapterSumByBookId(
    bookId: MongoId,
  ): Promise<BookChaptersInfo> {
    const chapters = await this.chapterModel.aggregate<BookChaptersInfo>([
      { $match: { bookId: new mongoose.Types.ObjectId(bookId) } },
      {
        $group: {
          _id: null,
          wordCount: { $sum: '$wordCount' },
          chapterCount: { $sum: 1 },
        },
      },
      { $project: { _id: 0 } },
    ]);
    const response = {
      wordCount: 0,
      chapterCount: 0,
    };
    return chapters[0] ?? response;
  }

  private async updateBookCounts(bookId: MongoId): Promise<void> {
    await this.bookService.updateCounts(
      bookId,
      await this.getChapterSumByBookId(bookId),
    );
  }

  async create(dto: CreateChapterDto, userId: MongoId): Promise<ChapterDto> {
    const { title, bookId, text, order } = dto;
    await this.bookService.findById(dto.bookId, userId);
    const chapter = toChapterDto(
      await this.chapterModel.create({
        title,
        bookId,
        text,
        order,
        wordCount: countWords(text ?? ''),
      }),
    );
    await this.updateBookCounts(bookId);
    return chapter;
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
    const chapter = await this.getChapterDocument(id, userId);
    const { title, order, text } = dto;
    let wordCount: number | undefined;
    if (text !== undefined) {
      wordCount = countWords(text);
    }
    const updatedChapter = toChapterDto(
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
    await this.updateBookCounts(chapter.bookId);
    return updatedChapter;
  }

  async delete(id: MongoId, userId: MongoId): Promise<void> {
    const chapter = await this.getChapterDocument(id, userId);
    await this.chapterModel
      .findByIdAndDelete(id)
      .orFail(new NotFoundException(NOT_FOUND));
    await this.updateBookCounts(chapter.bookId);
  }

  @OnEvent(BOOK_DELETED, { suppressErrors: false })
  async onBookDeleted(bookId: MongoId): Promise<void> {
    await this.chapterModel.deleteMany({ bookId });
  }
}
