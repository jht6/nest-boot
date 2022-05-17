import { HttpException } from '@nestjs/common';

export const isDev = process.env.SERVER_ENV === 'development';
export const isProd = process.env.SERVER_ENV === 'prod';

export const abort = (msg: string, code = 412) => {
  throw new HttpException(msg, code);
};

export const isNumeric = (n: any) => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};
