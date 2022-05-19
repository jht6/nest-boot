import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { loggerMiddleware } from './common/middleware/logger.middleware';
import { ENV_FILE } from './common/const/index';
import { CoreModule } from './core/core.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { isDev } from './common/util';
import { LabModule } from './lab/lab.module';

// 根据环境变量选择配置文件
const envFile = ENV_FILE[process.env.SERVER_ENV];
if (!envFile) {
  throw Error(`SERVER_ENV=${process.env.SERVER_ENV} 未找到相应配置文件`);
}
console.log(`使用的配置文件: ${envFile}`);

const getDBConfig = (configService: ConfigService) => {
  const host = configService.get('DB_HOST');
  const port = Number(configService.get('DB_PORT'));
  const username = configService.get('DB_USER');
  const password = configService.get('DB_PWD');
  return {
    type: 'mysql' as 'mysql',
    host,
    port,
    username,
    password,
    timezone: '+08:00',
    dateStrings: true, // 日期类型强制转为字符串
    supportBigNumbers: true,
    bigNumberStrings: false, // 仅当无法用js的Number精确表示时转为string
    autoLoadEntities: true,
    synchronize: false,
    logging: isDev,
  };
};

@Module({
  imports: [
    // 载入配置
    ConfigModule.forRoot({
      envFilePath: envFile,
      isGlobal: true,
    }),

    // DB连接 main_db库
    TypeOrmModule.forRootAsync({
      name: 'default', // 项目的默认数据库，名称勿改
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const baseConfig = getDBConfig(configService);
        const database = configService.get('DB_DATABASE');
        return {
          ...baseConfig,
          database,
        };
      },
    }),

    // DB连接 other_db库
    TypeOrmModule.forRootAsync({
      name: 'other',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const baseConfig = getDBConfig(configService);
        const database = configService.get('DB_OTHER_DB');
        return {
          ...baseConfig,
          database,
        };
      },
    }),

    CoreModule,

    LabModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(loggerMiddleware).forRoutes('*');
  }
}
