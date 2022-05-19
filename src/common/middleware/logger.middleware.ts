import { Response, NextFunction } from 'express';
import { ReqX } from '../interface/req.interface';
import { getUuid } from '../util/uuid';
import { logger } from '../util/logger';
import { dateToLocalString } from '../util/transformer';

// 本中间件应该在内置的body-parser中间件之后挂载，才能否访问req.body
// 因此需要在consumer中进行挂载，详见src/app.module.ts
export function loggerMiddleware(req: ReqX, res: Response, next: NextFunction) {
  const uuid = getUuid();

  req.uuid = uuid;
  req.logger = logger.child({
    uuid,
    create_time: dateToLocalString(new Date()),
    host: req.hostname,
    path: req.path,
    http_method: req.method,
    http_params: JSON.stringify(req.query),
    http_payload: JSON.stringify(req.body),
    user_agent: req.get('user-agent'),
    referer: req.get('referer'),
  });

  next();
}
