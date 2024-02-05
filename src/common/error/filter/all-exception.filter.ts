import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { Request, Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const response = http.getResponse<Response>();
    const { method, url } = http.getRequest<Request>();
    const statusCode =
      exception instanceof HttpException
        ? exception?.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR
        : HttpStatus.INTERNAL_SERVER_ERROR;
    let message =
      ((exception as Record<string, any>)?.response?.message as string) ||
      exception?.message;
    if (Array.isArray(message)) {
      message = JSON.stringify(message);
    }

    const errorResult: { error: any } = {
      error: {
        statusCode,
        timestamp: new Date().toISOString(),
        //  DateService().GenerateISODate(),
        method: method,
        path: url,
        message,
      },
    };

    response.status(statusCode).json(errorResult);
  }
}
