import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const http = host.switchToHttp();
		const response = http.getResponse<Response>();
		const request = http.getRequest<Request>();
		let status = exception.getStatus();
		let message = exception['response']['message'] as string || exception.message;
		if (Array.isArray(message)) {
			message = JSON.stringify(message);
		}
		if (!status) {
			status = HttpStatus.INTERNAL_SERVER_ERROR;
		}

		const errorResult = {
			statusCode: status,
			timestamp: new Date().toISOString(),
			method: request.method,
			path: request.url,
			message
		};
		response.status(status).json(errorResult);
	}
}