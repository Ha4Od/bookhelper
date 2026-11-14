import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedRequest } from './auth-request.interface';
import {MongoId} from "../common/mongo-id-type";

export const CurrentUser = createParamDecorator(
  (_, context: ExecutionContext): MongoId => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.user.userId;
  },
);
