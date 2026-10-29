import mongoose, {Types} from "mongoose";
import {Prop} from "@nestjs/mongoose";
import {IsMongoId, IsNotEmpty, IsOptional, IsString, MinLength} from "class-validator";

export class CreateCharacterDto {

    @IsString()
    @MinLength(3, { message: 'Character name must be at least 3 characters long' })
    name:string;

    @IsMongoId()
    @IsNotEmpty()
    bookId: string;

    @IsOptional()
    @IsString()
    role: string;

    @IsOptional()
    @IsString()
    description: string;

}