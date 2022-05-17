import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReqX } from 'src/common/interface/req.interface';
import { Response } from 'src/common/interface/response.interface';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const req: ReqX = ctx.getRequest();
    return next.handle().pipe(
      map((data) => {
        return {
          data,
          status_code: 0,
          message: 'ok',
          uuid: req.uuid,
        };
      }),
    );
  }
}
