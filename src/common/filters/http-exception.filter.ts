import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ReqX } from '../interface/req.interface';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const req: ReqX = ctx.getRequest();
    const msg = exception.getResponse();

    req.logger.error(exception.stack);

    response.status(200).json({
      status_code: 412,
      message: typeof msg === 'string' ? msg : JSON.stringify(msg),
      uuid: req.uuid,
    });
  }
}
