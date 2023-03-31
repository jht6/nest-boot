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

# 鉴权

代码位置：src/common/guards/auth.guard.ts

Nestjs 推荐使用守卫处理鉴权流程，并提供了 CanActivate 类供开发者使用。项目中实现一个 AuthGuard 类，其继承自 CanActivete 类，需要自行实现 canActivete() 方法并且由此方法的返回值决定鉴权是否通过：

- true：鉴权通过
- false：鉴权未通过

canActivete() 方法支持返回 Promise<boolean> 类型处理异步场景

# 请求参数校验

### DTO 声明

DTO 是指请求参数，使用 class-validator 库提供的装饰器声明各字段类型：

```ts
// src/lab/dto/lab.dto.ts

export class PostJsonDto {
  @IsNotEmpty()
  @IsNumber()
  num: number;

  @IsNotEmpty()
  @IsString()
  str: string;
}

// ...
```

### 获取参数并校验

在 controller 中，使用 @Body 装饰器获取请求参数，同时会自动对参数进行校验:

```ts
// src/lab/lab.controller.ts

@Post200('/post_json')
postJson(@Body() postJsonDto: PostJsonDto) {
  const { num, str } = postJsonDto;
  return {
    num,
    str,
  };
}

// ...
```

### json 中含嵌套对象

dto 声明方式：

```ts
// src/lab/dto/lab.dto.ts

export class Paging {
  @IsNotEmpty()
  @IsNumber()
  size: number;

  @IsNotEmpty()
  @IsNumber()
  index: number;
}
export class NestedData {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsObject()
  @ValidateNested({
    each: true,
  })
  paging: Paging;
}
```

### 校验器实现

校验器使用管道实现，基于 NestJS 提供的 ValidationPipe 进行扩展，在校验失败时会抛出 HttpException 异常，然后由异常过滤器捕获处理：

```ts
// src/common/pipes/validation.pipe.ts

export class GlobalValidationPipe extends ValidationPipe {
  constructor() {
    super({
      enableDebugMessages: isDev,
      transform: true,
      disableErrorMessages: false,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: (errors) => {
        let msg: string;
        try {
          const constraints = findErrMsg(errors);
          msg = Object.values(constraints).join('; ');
        } catch (e) {
          msg = '请求参数有误';
        }
        return new HttpException(msg, 412);
      },
    });
  }
}

// ...
```

# 装饰器

### Post200

NestJS 默认为 POST 请求设置 201 状态码，而常见的需求是使用 200 状态码，因此封装了 `Post200` 装饰器替代 NestJS 提供的 `Post` 装饰器，用法：

```ts
// src/lab/controller.ts

// ...
import { Post200 } from 'src/common/decorator';

@Post200('/post_json')
postJson(@Body() postJsonDto: PostJsonDto) {
  const { num, str } = postJsonDto;
  return {
    num,
    str,
  };
}
// ...
```

### CreateDateColumnX

typeorm 在查询 DB 后，日期类型值会转为 Date 实例，在 json 序列化时会转为 ISO 格式字符串，形如 "2022-05-12T11:22:33.444Z"

而常见场景是希望转成 YYYY-MM-DD HH:mm:ss 格式，因此封装了这个字段类型装饰器用于转换 DB 中“创建时间”字段值，用法如下：

```ts
// src/tab/entities/lab.entity.ts

import { CreateDateColumnX } from 'src/common/decorator';

@Entity('t_user')
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  user_name: string;

  @CreateDateColumnX()
  create_time: Date;
}

// ...
```

### UpdateDateColumnX

更新时间，说明同上

### DeleteDateColumnX

删除时间，说明同上

# 日志

### logger

代码位置：src/common/util/logger.ts

基于 winston 实现 logger，主要含三部分：

- 控制台打印信息，含时间、请求方法、请求 path、打印日志
- 本地测试日志文件，用于调试日志格式，默认不放开
- 生产环境日志，可自行采集上报到日志平台

### 使用 logger

代码位置：src/common/middleware/logger.middleware.ts

在日志中间件中，会将 logger 挂在 req 对象上；业务在任意可访问 req 的地方均可使用 logger

req.logger 已经默认记录了 uuid、create_time、host、path 等请求信息，其中 uuid 会在附加在响应 json 中，方便搜索日志

logger 的详细使用方式可参见[winston 文档](https://github.com/winstonjs/winston)

### 日志拦截器

代码位置：src/core/interceptors/logging.interceptor.ts

作用：记录响应 JSON

### 异常日志

代码位置：src/common/filters

- http-exception.filter.ts: 记录业务中手动抛出的 HttpException 信息
- native-exception.filter.ts：记录运行时产生的异常信息

# 响应 JSON

代码位置：src/core/interceptors/transform.interceptor.ts

响应 JSON 需要有统一结构格式，含数据、错误码、错误信息、uuid 等。

每个 controller 只需要关注响应数据，而错误码、uuid 等信息应该在另一个地方统一处理，NestJS 推荐使用拦截器处理响应 JSON。

最终的响应 JSON 格式为：

```js
{
  data,
  status_code: 0,
  message: 'ok',
  uuid,
}
```

# 异常处理

支持两类异常处理：

- http-exception: 开发者手动抛出 HttpException
- native-exception：运行时异常处理

相应地异常过滤器可以捕获异常，并生成响应 JSON；JSON 中携带 uuid，方便搜索相关日志

### HttpException

代码位置：
src/common/filters/http-exception.filter.ts
src/common/util/index.ts:abort

说明：用于捕获开发者手动抛出的 HttpException 并生成响应 JSON，可以使用 abort()方便地抛出异常

### NativeException

代码位置：src/common/native-exception.filter.ts

说明：用于捕获运行时产生的各类异常，记录错误日志并生成响应 JSON

# 请求/响应对象

### ReqX

继承自 Request，扩展了几个属性：

- uuid: 请求唯一标识，主要用于串联本处理请求过程中的所有日志
- logger：基于 winston 封装的 logger，用于记录日志
- userInfo: 建议开发者在鉴权通过后(auth.guard.ts)将用户信息附加在 req 上，方便在 controller 中获取

```ts
// src/common/interface/req.interface.ts

export interface ReqX extends Request {
  uuid: string;
  logger: Logger;
  userInfo?: any;
}
```

### Response

```ts
// src/common/interface/response.interface.ts
export interface Response<T> {
  data: T;
  status_code: number;
  message: string;
}
```

# 配置

### 配置文件

项目根目录下的.env.{name}文件

- .env.development: 开发环境配置
- .env.prod: 生产环境配置

可根据需要自行添加配置文件

### 挂载配置

使用 NestJS 提供的 ConfigModule 即可挂载配置，在 src/app.module.ts 中挂载

### 读取配置

由于配置是通过 ConfigModule 挂载的，读取数据需使用 ConfigService。具体方法为：

- 首先通过依赖注入拿到 configService
- 调用 get 方法即可

```ts
// src/app.module.ts

// ...

@Module({
  imports: [
    // 载入配置
    ConfigModule.forRoot({
      envFilePath: envFile,
      isGlobal: true,
    }),

// ...
```

# DB 连接

### 初始化

在 app.module.ts 中使用 TypeOrmModule 初始化 DB，支持多个 DB：

```ts
// src/app.module.ts

// ...

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

// ...
```

需重点注意 name 为对 DB 连接的命名，多 DB 场景中必须要有一个名称为 'default'，其余的名称可自定义。

### 多 DB 连接

当有多个 DB 连接时，查询数据库必然要确定使用哪个 DB 连接。需要向 InjectRepository() 传入 name 来确定 DB 连接。

当没传入 name 时，则使用 default 连接；若传入了 name，则使用 name 所指代的连接:

```ts
// src/lab/lab.service.ts

@Injectable()
export class LabService {
  constructor(
    @InjectRepository(User)
    public readonly mainRepo: Repository<User>,
    @InjectRepository(Log, 'other')
    public readonly logRepo: Repository<Log>,
  ) {}
}
```

注意需要在 Module 中引入依赖（要保证 name 值不要传错，否则会报错）:

```ts
// src/lab/lab.module.ts

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Log], 'other'),
  ],
  controllers: [LabController],
  providers: [LabService],
})
export class LabModule {}
```

# abort

在 controller 的执行流程中，常常需要终止执行并响应错误信息（例如用户无权限），可以使用 abort()函数。

本质是抛出一个 HttpException，由相应的异常过滤器捕获，记录相关日志并生成响应 JSON。

代码位置：src/common/util/index.ts

# docker 镜像

项目目录下的 build_docker.sh 脚本用于构建 docker 镜像，开发者只需要确认自己的镜像仓库地址并替换 repo 变量值即可构建 docker 镜像

# 环境变量

启动容器时需要设置环境变量：

- SERVER_ENV: 可选值参见 src/common/const/index.ts
