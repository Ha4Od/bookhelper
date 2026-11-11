import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {ACCESS_TOKEN} from "./auth.constants";
import type { Request } from 'express'
import {AuthenticatedRequest} from "./auth-request.interface";
import {JwtPayload} from "./jwt-payload.interface";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    private extractToken(request: Request): string | undefined {
        return request.cookies?.[ACCESS_TOKEN];
    }


    async canActivate(context: ExecutionContext):Promise<boolean> {
        const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

        const token = this.extractToken(request);

        if(!token) {
            throw new UnauthorizedException("Unauthorized");
        }
        try{
            const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
            request.user = { userId: payload.sub };
        }catch{
            throw new UnauthorizedException("Unauthorized");
        }

        return true;
    }
}