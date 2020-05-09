import { Injectable, NestInterceptor, ExecutionContext, NotFoundException, CallHandler } from "@nestjs/common";
import { tap } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable()
export class NotFoundInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        // next is an Observable of the controller's result value
        return next.handle()
            .pipe(tap(data => {
                if (data === undefined) throw new NotFoundException();
            }));
    }
}
