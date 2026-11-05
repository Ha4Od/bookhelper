import { BookDto } from '@bookhelper/shared';
import { BookDocument } from './book.schema';

export function toBookDto(book: BookDocument): BookDto {
  return {
    _id: book._id.toString(),
    userId: book.userId.toString(),
    title: book.title,
    createdAt: book.createdAt.toISOString(),
    updatedAt: book.updatedAt.toISOString(),
  };
}
