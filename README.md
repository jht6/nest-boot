# Nest Boot

快速搭建基于[NestJS](https://github.com/nestjs/nest)服务端项目，包含常见的服务端特性，开箱即用。

## 安装依赖

```bash
$ npm install
```

### Docker

确保你已经安装 Docker 后，执行：

```bash
docker-compose up
```

项目中提供了 `docker-compose.yml`，上述命令会启动一个 MySQL 镜像并初始化数据，详见`create_db.sql`。

停止 Docker 运行：

```bash
docker-compose down
```

## 启动服务器

```bash
# 开发模式
npm run start:debug
```

# 容器部署

创建负载时，需设置容器的环境变量：

- SERVER_ENV=prod
