import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateBookDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsString()
  title: string;
}
