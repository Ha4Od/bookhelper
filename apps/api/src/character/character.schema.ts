import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type CharacterDocument = HydratedDocument<Character>;

@Schema({ timestamps: true })
export class Character {
  @Prop({ required: true, minlength: 3 })
  name: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Book' })
  bookId: Types.ObjectId;

  @Prop({ required: false, default: '' })
  role: string;

  @Prop({ required: false, default: '' })
  description: string;

  createdAt: Date;

  updatedAt: Date;
}

export const CharacterSchema = SchemaFactory.createForClass(Character);

CharacterSchema.index({ bookId: 1, name: 1 });
