import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Character {
  @Prop({ required: true, minlength: 3 })
  name: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Book' })
  bookId: Types.ObjectId;

  @Prop()
  role: string;

  @Prop()
  description: string;
}

export const CharacterSchema = SchemaFactory.createForClass(Character);
