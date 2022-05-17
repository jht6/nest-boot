## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

### Docker

项目中提供了 `docker-compose.yml` 用于启动 Mysql 数据库 Docker。

`docker-compose up`

停止 Docker 运行：

`docker-compose down`

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# TKE

创建负载时，需设置环境变量：

- SERVER_ENV=prod
