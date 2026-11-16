import { ChapterDocument } from './chapter.schema';
import { ChapterListItemDto } from '@bookhelper/shared';

export function toChapterFrontDto(
  chapter: ChapterDocument,
): ChapterListItemDto {
  return {
    _id: chapter._id.toString(),
    bookId: chapter.bookId.toString(),
    title: chapter.title,
    order: chapter.order,
    wordCount: chapter.wordCount,
  };
}
