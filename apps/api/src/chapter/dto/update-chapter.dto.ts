import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class UpdateChapterDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  title?: string;

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  order?: number;
}
