import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ACCESS_TOKEN } from './auth.constants';
import type { Request } from 'express';
import type { AuthenticatedRequest } from './auth-request.interface';
import { JwtPayload } from './jwt-payload.interface';
import { Reflector} from "@nestjs/core";
import {IS_PUBLIC_KEY} from "./ public.decorator";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService,
              private reflector: Reflector) {}

  private extractToken(request: Request): string | undefined {
    return request.cookies?.[ACCESS_TOKEN];
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
    ])
    if(isPublic){
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      request.user = { userId: payload.sub };
    } catch {
      throw new UnauthorizedException('Unauthorized');
    }

    return true;
  }
}
