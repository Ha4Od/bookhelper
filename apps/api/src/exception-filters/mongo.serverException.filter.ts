import { Catch, HttpException } from '@nestjs/common';
import { mongo } from 'mongoose';
import { response, request} from 'express';

@Catch(mongo.MongoServerError)
export class MongoServerExceptionFilter extends HttpException{
  catch(exception: mongo.MongoServerError){
    response.status(409)
      .json({
        statusCode: mongo.MongoServerError.arguments.statusCode,
        timestamp: new Date().toISOString(),
        path: request.url,
      });

  }
}