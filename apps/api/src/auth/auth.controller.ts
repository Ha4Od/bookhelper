import {Body, Controller, HttpCode, HttpStatus, Injectable, Post, Res} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {UserLoginDto} from "./dto/user-login.dto";
import {HttpAdapterHost} from "@nestjs/core";
import {UserDto} from "@bookhelper/shared";
import {ConfigService} from "@nestjs/config";
import {CreateUserDto} from "../user/dto/create-user.dto";
import {ACCESS_TOKEN} from "./auth.constants";



@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService,
                private readonly adapterHost: HttpAdapterHost,
                private readonly configService: ConfigService) {}

    @Post("login")
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto: UserLoginDto,
                @Res({ passthrough: true }) res: unknown): Promise<UserDto> {
        const loginResponse = await this.authService.login(dto);
        this.adapterHost.httpAdapter.setCookie(res, ACCESS_TOKEN, loginResponse.accessToken,{
            httpOnly: true,
            secure: this.configService.get('NODE_ENV') === 'production',
            sameSite: 'lax',
            maxAge: 60*60,
        });
        return loginResponse.user;
    }

    @Post("register")
    async register(@Body() dto: CreateUserDto): Promise<UserDto> {
        return this.authService.register(dto);
    }

    @Post('logout')
    @HttpCode(HttpStatus.NO_CONTENT)
    logOut(@Res({ passthrough: true }) res: unknown) {
        this.adapterHost.httpAdapter.clearCookie(res, ACCESS_TOKEN);
    }
}