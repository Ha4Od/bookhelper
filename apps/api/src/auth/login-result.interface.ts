import {UserDto} from "@bookhelper/shared";

export interface UserLoginResponse {
    accessToken: string;
    user: UserDto;
}