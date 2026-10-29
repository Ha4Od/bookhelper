import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { mongo } from 'mongoose';
import {Request, Response} from 'express';

@Catch(mongo.MongoServerError)
export class MongoServerExceptionFilter implements ExceptionFilter{
  catch(exception: mongo.MongoServerError, host: ArgumentsHost){
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status: number = (exception.code === 11000) ? HttpStatus.CONFLICT : HttpStatus.INTERNAL_SERVER_ERROR;

    if(status === HttpStatus.CONFLICT){
      response
        .status(status)
        .json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          message: `${Object.keys(exception.keyValue)[0]} already exists`,
          path: request.url,
        });
    }else{
      response
        .status(status)
        .json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
        });
    }

  }
}