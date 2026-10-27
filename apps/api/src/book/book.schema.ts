import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {HydratedDocument} from "mongoose";
import {BookModule} from "./book.module";

export type BookDocument =HydratedDocument<Book>;
@Schema({timestamps: true})
export class Book{

    @Prop({required: true, unique: true})
    userId: string;

    @Prop({required: true, minlength: 3})
    bookTitle: string;
}

export const BookSchema = SchemaFactory.createForClass(Book);