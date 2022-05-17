import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { NativeExceptionFilter } from './common/filters/native-exception.filter';
import { GlobalValidationPipe } from './common/pipes/validation.pipe';
import { loggerMiddleware } from './common/middleware/logger.middleware';
import { AuthGuard } from './common/guards/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局中间件：挂载logger
  app.use(loggerMiddleware);

  // 挂载全局异常过滤器
  // 这里传参顺序会影响nest的查找filter的顺序，异常类继承关系中父类要放在前
  app.useGlobalFilters(new NativeExceptionFilter(), new HttpExceptionFilter());

  // 挂载全局请求参数验证管道
  app.useGlobalPipes(new GlobalValidationPipe());

  // 设置全局鉴权守卫
  const configService = app.get<ConfigService>(ConfigService);
  app.useGlobalGuards(new AuthGuard(configService));

  // 设置接口公共前缀
  app.setGlobalPrefix('/api');

  await app.listen(3000);
}

bootstrap();
