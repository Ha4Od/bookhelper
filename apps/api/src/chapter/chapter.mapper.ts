import {ChapterDto} from "@bookhelper/shared";
import {ChapterDocument} from "./chapter.schema";


export function toChapterDto(chapter: ChapterDocument): ChapterDto {
    return{
        _id: chapter._id.toString(),
        bookId: chapter.bookId.toString(),
        title: chapter.title,
        text: chapter.text,
        order: Number(chapter.order),
        createdAt: chapter.createdAt.toISOString(),
        updatedAt: chapter.updatedAt.toISOString(),
    }
}