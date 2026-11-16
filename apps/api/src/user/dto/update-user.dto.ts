import { IsString, MinLength, ValidateIf } from 'class-validator';

export class UpdateUserDto {
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @MinLength(3)
  name?: string;

  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @MinLength(3)
  nickname?: string;
}
