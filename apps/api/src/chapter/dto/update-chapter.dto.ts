import { IsInt, IsString, Min, MinLength, ValidateIf } from 'class-validator';

export class UpdateChapterDto {
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @MinLength(3)
  title?: string;

  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  text?: string;

  @ValidateIf((_, value) => value !== undefined)
  @IsInt()
  @Min(1)
  order?: number;
}
