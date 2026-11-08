import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Chapter, ChapterDocument } from './chapter.schema';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { OnEvent } from '@nestjs/event-emitter';
import { BOOK_DELETED } from '../book/book.events';
import { toChapterDto } from './chapter.mapper';
import { ChapterDto } from '@bookhelper/shared';
import { UpdateChapterDto } from './dto/update-chapter.dto';

@Injectable()
export class ChapterService {
  constructor(
    @InjectModel(Chapter.name)
    private readonly chapterModel: Model<ChapterDocument>,
  ) {}

  async create(dto: CreateChapterDto): Promise<ChapterDto> {
    return toChapterDto(await this.chapterModel.create(dto));
  }

  async findByBookId(bookId: Types.ObjectId): Promise<ChapterDto[]> {
    const chapters = await this.chapterModel
      .find({ bookId: bookId })
      .sort({ order: 1 });
    return chapters.map((chapter) => toChapterDto(chapter));
  }

  async findById(id: Types.ObjectId): Promise<ChapterDto> {
    return toChapterDto(
      await this.chapterModel
        .findById(id)
        .orFail(new NotFoundException('Chapter Not Found')),
    );
  }

  async update(id: Types.ObjectId, dto: UpdateChapterDto): Promise<ChapterDto> {
    return toChapterDto(
      await this.chapterModel
        .findByIdAndUpdate(id, dto, {
          returnDocument: 'after',
          runValidators: true,
        })
        .orFail(new NotFoundException('Chapter not found')),
    );
  }

  async delete(id: Types.ObjectId): Promise<void> {
    await this.chapterModel
      .findByIdAndDelete(id)
      .orFail(new NotFoundException('Chapter not found'));
  }

  @OnEvent(BOOK_DELETED, { suppressErrors: false })
  async onBookDeleted(bookId: Types.ObjectId): Promise<void> {
    await this.chapterModel.deleteMany({ bookId });
  }
}
