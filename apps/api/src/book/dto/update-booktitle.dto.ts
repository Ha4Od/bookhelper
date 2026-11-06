import { IsString, MinLength } from 'class-validator';

export class UpdateBookTitleDto {
  @IsString()
  @MinLength(3)
  title: string;
}
