import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type CharacterDocument =  HydratedDocument<Character>;


@Schema({ timestamps: true })
export class Character {
  @Prop({ required: true, minlength: 3 })
  name: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Book' })
  bookId: Types.ObjectId;

  @Prop()
  role: string;

  @Prop()
  description: string;
}

export const CharacterSchema = SchemaFactory.createForClass(Character);
