import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateCharacterDto {
  @IsOptional()
  @IsString()
  @MinLength(3, {
    message: 'Character name must be at least 3 characters long',
  })
  name?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
