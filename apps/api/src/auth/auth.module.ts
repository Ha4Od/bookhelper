import {Module} from "@nestjs/common";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {JwtModule} from "@nestjs/jwt";
import {getJwtConfig} from "../config/mongo.config";
import {UserModule} from "../user/user.module";
import {AuthService} from "./auth.service";
import {AuthController} from "./auth.controller";


@Module({
    imports: [
        UserModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: getJwtConfig,
        })
    ],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}