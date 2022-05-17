import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ReqX } from '../interface/req.interface';

@Catch(Error)
export class NativeExceptionFilter implements ExceptionFilter<Error> {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const req: ReqX = ctx.getRequest();

    req.logger.error(exception.stack);

    response.status(200).json({
      status_code: 412,
      message: '服务异常，请联系开发人员',
      uuid: req.uuid,
    });
  }
}
