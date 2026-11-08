import { IsString, MinLength, ValidateIf } from 'class-validator';

export class UpdateCharacterDto {
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @MinLength(3, {
    message: 'Character name must be at least 3 characters long',
  })
  name?: string;

  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  role?: string;

  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  description?: string;
}
