import { Controller, Get, Body } from '@nestjs/common';
import { abort } from 'src/common/util';
import { LabService } from './lab.service';
import { PostJsonDto, NestedData } from './dto/lab.dto';
import { Post200 } from 'src/common/decorator';

@Controller('lab')
export class LabController {
  constructor(private readonly labService: LabService) {}

  @Get('/get')
  get() {
    return '666';
  }

  // 请求json
  // curl -H 'content-type:application/json' -d '{"num":1,"str":"xx"}' localhost:3000/api/lab/post_json
  @Post200('/post_json')
  postJson(@Body() postJsonDto: PostJsonDto) {
    const { num, str } = postJsonDto;
    return {
      num,
      str,
    };
  }

  // 请求json带嵌套
  // curl -H 'content-type:application/json' -d '{"id":1,"paging":{"size":10,"index":0}}' localhost:3000/api/lab/post_nested
  // curl -H 'content-type:application/json' -d '{"id":1,"paging":{"size":"a","index":0}}' localhost:3000/api/lab/post_nested
  @Post200('/post_nested')
  postNestedData(@Body() nestedData: NestedData) {
    const {
      id,
      paging: { size, index },
    } = nestedData;
    return {
      id,
      size,
      index,
    };
  }

  @Get('/test_abort')
  testAbort() {
    abort('tsy666');
  }

  @Get('/test_error')
  testError() {
    const x = null;
    return x.split('.');
  }

  @Get('/get_users')
  async getUsers() {
    const users = await this.labService.mainRepo.find({
      select: ['user_id', 'user_name'],
    });
    return users;
  }

  @Get('/get_logs')
  async getLogs() {
    const logs = await this.labService.logRepo.find({
      select: ['log_id', 'log_msg'],
    });
    return logs;
  }
}
