import { ValidationPipe, HttpException, ValidationError } from '@nestjs/common';
import { isDev } from '../util';

// 递归查找错误信息，因为嵌套对象的错误信息也是嵌套的
const findErrMsg = (errors: ValidationError[]) => {
  const err = errors[0];
  if (err.constraints) {
    return err.constraints;
  } else {
    return findErrMsg(err.children);
  }
};

export class GlobalValidationPipe extends ValidationPipe {
  constructor() {
    super({
      enableDebugMessages: isDev,
      transform: true,
      disableErrorMessages: false,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: (errors) => {
        let msg: string;
        try {
          const constraints = findErrMsg(errors);
          msg = Object.values(constraints).join('; ');
        } catch (e) {
          msg = '请求参数有误';
        }
        return new HttpException(msg, 412);
      },
    });
  }
}
