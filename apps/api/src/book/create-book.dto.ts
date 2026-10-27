import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  bookTitle: string;
}
