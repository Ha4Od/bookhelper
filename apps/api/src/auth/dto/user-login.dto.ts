import {IsEmail, IsNotEmpty, MaxLength, MinLength} from "class-validator";


export class UserLoginDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @MaxLength(128, { message: 'Password must be 128 characters long at most' })
    password: string;
}