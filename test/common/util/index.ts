import * as mysql from 'mysql2';
import axios from 'axios';

// 创建数据库连接
export const createDbConn = () => {
  const conn = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'main_db',
  });
  return conn;
};

export const request = ({
  method,
  path,
  data,
}: {
  method: 'get' | 'post';
  path: string;
  data?: object;
  auth: string;
}) => {
  return axios.request({
    method,
    url: `http://localhost/server/api/v3${path}`,
    data,
  });
};

export const post = (path: string, data: object, auth?: string) => {
  return request({
    method: 'post',
    path,
    data,
    auth,
  });
};

export const get = (path: string, auth?: string) => {
  return request({
    method: 'post',
    path,
    auth,
  });
};
