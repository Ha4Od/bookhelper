import {
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateChapterDto {
  @IsString()
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  title: string;

  @IsMongoId()
  @IsNotEmpty()
  bookId: string;

  @IsOptional()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  order: number;
}
