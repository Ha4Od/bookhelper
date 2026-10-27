import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Chapter {
  @Prop({ minlength: 3, required: true })
  title: string;

  @Prop({ required: true })
  bookId: Types.ObjectId;

  @Prop()
  text: string;

  @Prop({ required: true })
  order: string;
}

export const ChapterSchema = SchemaFactory.createForClass(Chapter);

ChapterSchema.index({ bookId: 1, order: 1 }, { unique: true });
