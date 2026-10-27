import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {HydratedDocument} from "mongoose";

@Schema({ timestamps: true })
export class Chapter {
  @Prop({ minlength: 3, required: true,})
  title: string;

  @Prop({ required: true})
  bookId: string;

  @Prop()
  text: string;

  @Prop({required: true, unique: true})
  order: string;
}

export const ChapterSchema = SchemaFactory.createForClass(Chapter);