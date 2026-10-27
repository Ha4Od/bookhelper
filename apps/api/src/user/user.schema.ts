import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {HydratedDocument} from "mongoose";

@Schema({timestamps: true})
export class User{

    @Prop({required: true, minlength: 3})
    name: string;

    @Prop({required: true, unique: true, IsEmail: true})
    email: string;

    @Prop({required: true})
    passwordHash: string;

    @Prop({required: true, unique: true})
    nickname: string;
}

export const UserSchema = SchemaFactory.createForClass(User);