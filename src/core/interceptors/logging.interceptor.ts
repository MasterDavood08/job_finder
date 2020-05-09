
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadGatewayException } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { ResponseError } from '../dto/response.dto';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        console.log('Before...');

        const now = Date.now();
        return next
            .handle()
            .pipe(

                tap(() => console.log(`After... ${Date.now() - now}ms`)),
                // catchError(err => throwError(new BadGatewayException())),
            );
    }
}
