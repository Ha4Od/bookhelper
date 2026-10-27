import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {HydratedDocument} from "mongoose";

@Schema({timestamps: true})
export class Character {
  @Prop({required: true, minlength: 3})
  name: string;

  @Prop({required: true})
  bookId: string;

  @Prop()
  role: string;

  @Prop()
  description: string;
}

export const CharacterSchema = SchemaFactory.createForClass(Character);