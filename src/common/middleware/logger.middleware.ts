import { Response, NextFunction } from 'express';
import { ReqX } from '../interface/req.interface';
import { getUuid } from '../util/uuid';
import { logger } from '../util/logger';
import { dateToLocalString } from '../util/transformer';

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
