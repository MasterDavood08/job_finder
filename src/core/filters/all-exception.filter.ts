import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    let status = (exception instanceof HttpException) ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    // if (status === HttpStatus.UNAUTHORIZED) 
    //     return response.status(status).render('views/401');
    // if (status === HttpStatus.NOT_FOUND) 
    //     return response.status(status).render('views/404');
    // if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
    //     if (process.env.NODE_ENV === 'production') {
    //       console.error(error.stack);
    //       return response.status(status).render('views/500');
    //     }
    //     else {
    //       let message = error.stack;
    //       return response.status(status).send(message); 
    //     } 
    // }
    // if (status === HttpStatus.NOT_FOUND) {
    //   status = HttpStatus.NOT_FOUND;
    // }

    if (status === HttpStatus.SERVICE_UNAVAILABLE) {
      status = HttpStatus.SERVICE_UNAVAILABLE;
    }

    if (status === HttpStatus.NOT_ACCEPTABLE) {
      status = HttpStatus.NOT_ACCEPTABLE;
    }

    if (status === HttpStatus.EXPECTATION_FAILED) {
      status = HttpStatus.EXPECTATION_FAILED;
    }

    if (status === HttpStatus.BAD_REQUEST) {
      status = HttpStatus.BAD_REQUEST;
    }

    console.error(exception.stack);

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}
