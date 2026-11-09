import { Module, ValidationPipe } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChapterModule } from './chapter/chapter.module';
import { CharacterModule } from './character/character.module';
import { UserModule } from './user/user.module';
import { BookModule } from './book/book.module';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { MongoServerExceptionFilter } from './exception-filters/mongo.serverException.filter';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getMongoConfig } from './config/mongo.config';
import {AuthModule} from "./auth/auth.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoConfig,
    }),
    BookModule,
    UserModule,
    ChapterModule,
    CharacterModule,
    AuthModule,
    EventEmitterModule.forRoot({}),
  ],
  controllers: [],
  providers: [
    { provide: APP_FILTER, useClass: MongoServerExceptionFilter },
    { provide: APP_PIPE, useValue: new ValidationPipe({ whitelist: true }) },
  ],
})
export class AppModule {}
