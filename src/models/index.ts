import * as maptalks from 'maptalks';
// with node-canvas 2.0
import Canvas from 'canvas';

// load node adapters, source: https://github.com/maptalks/maptalks.node
import 'maptalks.node';
// const Image: any = Canvas.Image;
// register node-canvas's Image as a global class
// global['Image'] = Image;

const GetMap: any = async (ctx, next) => {
  try {
    const canvas = new Canvas(400, 300);
    const map = new maptalks.Map(canvas, {
      center : [0, 0],
      zoom : 3,
      baseLayer : new maptalks.TileLayer('base', {
        'urlTemplate' : 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        'subdomains'  : ['a', 'b', 'c', 'd', 'e'],
      })
    });
    map.on('load', () => {
      ctx.status = 200;
      ctx.body = {
        code: 200,
        success: true,
        data: '加载成功'
      };
    });
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      code: 500,
      success: false,
      data: error
    };
  }
};

export default GetMap;
