import {Types} from "mongoose";
import {IsMongoId, IsNotEmpty, IsOptional, IsString, MinLength} from "class-validator";

export class CreateChapterDto {

    @IsString()
    @MinLength(3, { message: 'Title must be at least 3 characters long' })
    title : string;

    @IsMongoId()
    @IsNotEmpty()
    bookId: Types.ObjectId;

    @IsOptional()
    text: string;

    @IsOptional()
    order: number;
}