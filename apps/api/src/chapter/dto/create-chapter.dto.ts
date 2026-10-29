import {Types} from "mongoose";
import {
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateChapterDto {

    @IsString()
    @MinLength(3, { message: 'Title must be at least 3 characters long' })
    title : string;

    @IsMongoId()
    @IsNotEmpty()
    bookId: string;

    @IsOptional()
    @IsString()
    text: string;

    @IsNotEmpty()
    @IsInt()
    order: number;
}