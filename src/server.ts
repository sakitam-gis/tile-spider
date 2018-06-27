import * as http from 'http';
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as logger from 'koa-logger';
import * as cors from 'koa-cors';
import * as onerror from 'koa-onerror';
import * as convert from 'koa-convert';
import * as staticServer from 'koa-static';
import * as restc from 'restc';
import * as Canvas from 'canvas';
import router from './routers';
import { resolve } from './helper';
// register node-canvas's Image as a global class
global['Image'] = Canvas.Image;

const app: any = new Koa();
// error handler
onerror(app);
app.use(convert(cors()));
app.use(staticServer(resolve('images')));

// middlewares
app.use(bodyParser({
  enableTypes: ['json', 'form', 'text']
}));

app.use(restc.koa2());

// logger
app.use(logger());
app.use(async (ctx, next) => {
  const start: any = new Date();
  await next();
  const current: any = new Date();
  const ms: number = current - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(router.routes()).use(router.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

const server = http.createServer(app.callback()).listen(3456).on('listening', function () {
  console.log('正在监听端口: http://localhost:' + 3456);
});

export default server;
