import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type ChapterDocument = HydratedDocument<Chapter>;

@Schema({ timestamps: true })
export class Chapter {
  @Prop({ minlength: 3, required: true })
  title: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Book' })
  bookId: Types.ObjectId;

  @Prop({optional: true})
  text: string;

  @Prop({ required: true, type: Number, optional: true })
  order: number;
}

export const ChapterSchema = SchemaFactory.createForClass(Chapter);

ChapterSchema.index({ bookId: 1, order: 1 }, { unique: true });
