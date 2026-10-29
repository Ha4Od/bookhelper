import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { mongo } from 'mongoose';
import {Request, Response} from 'express';

@Catch(mongo.MongoServerError)
export class MongoServerExceptionFilter implements ExceptionFilter{
  catch(exception: mongo.MongoServerError, host: ArgumentsHost){
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status: number;
    if(exception.code === 11000){
      status = 409;
    }else status = 500;

    response
      .status(Number(status))
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });

  }
}