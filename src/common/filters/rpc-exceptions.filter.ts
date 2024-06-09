import { Catch, ArgumentsHost, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcExceptionToHttpExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const error = exception.getError();
    const message = error["message"] || "Неизвестная ошибка";
    const status = parseInt(error["status"]?.toString()) || HttpStatus.INTERNAL_SERVER_ERROR;

    console.log(message, status);

    response.status(status).json({
      statusCode: status,
      message: message,
    });
  }
}