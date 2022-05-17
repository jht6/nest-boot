import { applyDecorators, Post, HttpCode } from '@nestjs/common';
import {
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  ColumnOptions,
} from 'typeorm';
import { dateToLocalString } from '../util/transformer';

// POST且响应200状态码，解决nestjs默认201响应POST请求的问题
export const Post200 = (path: string | string[]) => {
  return applyDecorators(Post(path), HttpCode(200));
};

// 日期字段装饰器，实现读取日期类型时自动转格式
const dateTransformer = {
  to: (v) => v, // 原样写入DB
  from: (v) => dateToLocalString(v), // 读出时转为YYYY-MM-DD HH:mm:ss格式
};

export const CreateDateColumnX = (
  options?: ColumnOptions,
): PropertyDecorator => {
  return CreateDateColumn({
    ...options,
    transformer: dateTransformer,
  });
};

export const UpdateDateColumnX = (
  options?: ColumnOptions,
): PropertyDecorator => {
  return UpdateDateColumn({
    ...options,
    transformer: dateTransformer,
  });
};

export const DeleteDateColumnX = (
  options?: ColumnOptions,
): PropertyDecorator => {
  return DeleteDateColumn({
    ...options,
    transformer: dateTransformer,
  });
};
