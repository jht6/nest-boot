import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ReqX } from 'src/common/interface/req.interface';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');

    const now = Date.now();
    return next.handle().pipe(
      tap((resJson) => {
        const req = context.switchToHttp().getRequest<ReqX>();

        // 日志记录响应内容
        req.logger.info('OK', {
          response: JSON.stringify(resJson),
          status_code: 200,
        });

        console.log(`After... ${Date.now() - now}ms`);
      }),
    );
  }
}
