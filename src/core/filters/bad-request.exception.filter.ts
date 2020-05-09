import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException } from '@nestjs/common';
import { Request, Response } from 'express';
import { validate } from 'class-validator';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
    catch(exception: BadRequestException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        response
            .status(status)
            // you can manipulate the response here
            .json({
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
            });
    }
}
