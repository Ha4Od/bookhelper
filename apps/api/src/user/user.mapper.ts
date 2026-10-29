import {UserDocument} from "./user.schema";
import {UserDto} from "@bookhelper/shared";


export function toUserDto(user: UserDocument): UserDto {
    return {
        _id: user._id.toString(),
        email: user.email,
        name: user.name,
        nickname: user.nickname,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
    }
}