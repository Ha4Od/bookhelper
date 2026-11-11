import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class UserLoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @MaxLength(128, { message: 'Password must be 128 characters long at most' })
  password: string;
}
