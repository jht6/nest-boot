import * as winston from 'winston';
import { isProd } from './index';
import { dateToLocalString } from './transformer';

const { combine, timestamp, printf, json } = winston.format;

// 写入文件的日志为json格式，接入日志汇
export const logger = winston.createLogger({
  format: combine(timestamp(), json()),
  transports: [
    // 控制台打印格式单独处理，便于查看
    new winston.transports.Console({
      format: combine(
        timestamp(),
        printf(({ timestamp, level, message, http_method, path }) => {
          const xTimestamp = dateToLocalString(timestamp);
          const xLevel = level.toUpperCase();
          const xMsg =
            typeof message === 'string' ? message : JSON.stringify(message);

          return `[${xTimestamp}] ${http_method} ${path} [${xLevel}] -> ${xMsg}`;
        }),
      ),
    }),

    // 用于本地测试日志格式, 需要时去掉注释即可
    // !isProd && new winston.transports.File({ filename: 'test.log' }),

    // 生产环境日志，可自行使用采集模块上报到日志系统
    isProd && new winston.transports.File({ filename: '/data/log/server.log' }),
  ].filter(Boolean),
});
