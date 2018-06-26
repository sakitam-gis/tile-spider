import * as Router from 'koa-router';
import GetMap from '../models';
import { login, qrcode, islogin, getlogin } from '../models/login';

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

router.get('/api/jslogin', login);

router.get('/api/qrcode', qrcode);

router.get('/api/islogin', islogin);

router.get('/api/getlogin', getlogin);

export default router;
