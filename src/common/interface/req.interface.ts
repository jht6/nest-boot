import { Request } from 'express';
import { Logger } from 'winston';

export interface ReqX extends Request {
  uuid: string;
  logger: Logger;
  userInfo?: any;
}
