import { Module } from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import { ChapterModule } from './chapter/chapter.module';
import { CharacterModule } from './character/character.module';
import {UserModule} from "./user-module/user.module";
import {BookModule} from "./book-module/book.module";


@Module({
  imports: [
      MongooseModule.forRoot("mongodb://localhost:27017/bookhelper"),
      BookModule,
      UserModule,
      ChapterModule,
      CharacterModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
