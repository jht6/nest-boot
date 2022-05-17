import { createDbConn, post } from './common/util';

describe('cockpit模块接口测试', () => {
  let conn;

  beforeAll(() => {
    // 连接数据库
    conn = createDbConn();
  });

  afterAll(() => {
    // 断开数据库
    conn.end();
  });

  // test('创建cockpit', async () => {

  // })

  // test('xx', async () => {
  //   const [ret, field] = await conn.promise().query(`select 1`);

  //   expect(ret).toBeTruthy();
  // });

  test('req', async () => {
    const res = await post('/cockpit/page_list', { type: 0 });
    console.log('res', res);
  });
});
