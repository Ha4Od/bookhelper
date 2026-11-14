import { Module } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { ChapterController } from './chapter.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Chapter, ChapterSchema } from './chapter.schema';
import {BookModule} from "../book/book.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Chapter.name,
        schema: ChapterSchema,
      },
    ]),
      BookModule,
  ],
  providers: [ChapterService],
  controllers: [ChapterController],
})
export class ChapterModule {}
