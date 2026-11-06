import {IsMongoId, IsNotEmpty, IsString, MinLength} from 'class-validator';

export class CreateBookDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @MinLength(3)
  title: string;
}
