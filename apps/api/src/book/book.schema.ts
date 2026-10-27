import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type BookDocument = HydratedDocument<Book>;
@Schema({ timestamps: true })
export class Book {
  @Prop({ required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, minlength: 3 })
  bookTitle: string;
}

export const BookSchema = SchemaFactory.createForClass(Book);
