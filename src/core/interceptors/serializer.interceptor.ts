
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Serializable } from "../serializtion/serializable";
import { Observable, of, from } from "rxjs";
import { switchMap } from "rxjs/operators";

@Injectable()
export class SerializerInterceptor implements NestInterceptor {

    private async serializeResponse(
        response: Response,
        roles: string[]
    ): Promise<Record<string, any>> {
        const serializedProperties = await Promise.all(
            Object.keys(response).map(async (key) => {
                const value = response[key];

                if (!(value instanceof Serializable)) {
                    return {
                        key,
                        value,
                    };
                }

                const serializedValue = await value.serialize(roles);

                return {
                    key,
                    value: serializedValue,
                };
            }),
        );

        return serializedProperties.reduce((result, { key, value }) => {
            result[key] = value;

            return result;
        }, {});
    }

    public intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<any> {
        const request = context.switchToHttp().getRequest();

        return next.handle().pipe(
            switchMap((response) => {
                if (typeof response !== 'object' || response === null) {
                    return of(response);
                }

                return from(this.serializeResponse(response, request.user?.roles));
            }),
        );
    }
}
