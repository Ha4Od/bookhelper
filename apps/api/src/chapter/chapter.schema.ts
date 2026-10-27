import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Chapter {
  @Prop({ minlength: 3, required: true })
  title: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Book' })
  bookId: Types.ObjectId;

  @Prop()
  text: string;

  @Prop({ required: true, type: Number })
  order: number;
}

export const ChapterSchema = SchemaFactory.createForClass(Chapter);

ChapterSchema.index({ bookId: 1, order: 1 }, { unique: true });
