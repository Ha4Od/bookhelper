import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChapterModule } from './chapter/chapter.module';
import { CharacterModule } from './character/character.module';
import { UserModule } from './user/user.module';
import { BookModule } from './book/book.module';
import { APP_FILTER } from '@nestjs/core';
import { MongoServerExceptionFilter } from './exception-filters/mongo.serverException.filter';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/bookhelper'),
    BookModule,
    UserModule,
    ChapterModule,
    CharacterModule,
  ],
  controllers: [],
  providers: [{provide: APP_FILTER, useClass: MongoServerExceptionFilter}],
})
export class AppModule {}
