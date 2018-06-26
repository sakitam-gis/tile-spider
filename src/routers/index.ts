import * as Router from 'koa-router';
import GetMap from '../models';

const router: any = new Router();

router.get('/', async (ctx, next) => {
  ctx.status = 200;
  ctx.body = {
    code: 0,
    success: true,
    message: 'success',
    data: 'success'
  };
});

router.get('/map', GetMap);

export default router;
