import * as fs from 'fs';
import * as Router from 'koa-router';
import axios from 'axios';

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

router.get('/fetchfont', async (ctx, next) => {
  const { url } = ctx.query;
  let i: number = 0;
  const fetchList: Array<string> = [];
  const fileList: Array<any> = [];
  for (; i < 65535; i++) {
    fetchList.push(`${i}-${i + 255}`);
    i += 255;
  }
  for (let j = 0; j < fetchList.length; j++) {
    const file = fetchList[j];
    const url = `https://api.mapbox.com/fonts/v1/mapbox/DIN%20Offc%20Pro%20Medium,Arial%20Unicode%20MS%20Regular/${file}.pbf?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA`;
    const list = axios({
      method: 'get',
      url: url,
      responseType: 'stream'
    });
    fileList.push(list);
  }
  const data = await Promise.all(fileList);
  for (let k = 0; k < data.length; k++) {
    const response = data[k];
    response.data.pipe(fs.createWriteStream(`static/${fetchList[k]}.pbf`));
  }
  ctx.status = 200;
  ctx.body = {
    code: 200,
    success: true,
    data: 'success'
  };
});

export default router;
