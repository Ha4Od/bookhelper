import {Injectable, UnauthorizedException} from "@nestjs/common";
import {UserService} from "../user/user.service";
import {UserLoginDto} from "./dto/user-login.dto";
import {UserDto} from "@bookhelper/shared";
import {CreateUserDto} from "../user/dto/create-user.dto";
import argon2 from "argon2";
import {JwtService} from "@nestjs/jwt";
import {UserLoginResponse} from "./login-result.interface";
import { toUserDto } from "../user/user.mapper"

const DUMMY_HASH = "$argon2id$v=19$m=65536,p=4,t=3$tRz3oFIBDQtRz3T4lg3lOw$Z9OsoUj/xyU5/N0DD+pjThINcuFTC/qpwC1RoXkQpj8"

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService,
                private readonly jwtService: JwtService,) {}

    async login(dto: UserLoginDto): Promise<UserLoginResponse> {
        const {email, password} = dto;
        const user  = await this.userService.findByEmail(email);
        const isPasswordValid = await argon2.verify(user?.passwordHash ?? DUMMY_HASH, password);
        if(!isPasswordValid || !user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const accessToken = await this.jwtService.signAsync({sub: user.id});

        return {accessToken, user: toUserDto(user)}
    }

    async register(dto: CreateUserDto): Promise<UserDto> {
        return this.userService.create(dto);
    }
}