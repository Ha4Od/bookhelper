import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type BookDocument = HydratedDocument<Book>;
@Schema({ timestamps: true })
export class Book {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true, minlength: 3 })
  title: string;
}

export const BookSchema = SchemaFactory.createForClass(Book);
