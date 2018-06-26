import * as fs from 'fs';
import * as maptalks from 'maptalks';
// with node-canvas 2.0
import * as Canvas from 'canvas';
import { resolve } from '../helper/common';

// load node adapters, source: https://github.com/maptalks/maptalks.node
import 'maptalks.node';
// register node-canvas's Image as a global class
global['Image'] = Canvas.Image;

const GetMap: any = async (ctx, next) => {
  const { width, height, zoom, projection, url } = ctx.query;
  const canvas = new Canvas(width || 500, height || 500);
  const map = new maptalks.Map(canvas, {
    center: [116.0046413968285, 26.853333150317088],
    zoom: zoom || 11,
    spatialReference: {
      projection: projection || 'EPSG:3857'
    }
  });

  const layer = new maptalks.TileLayer('gd', {
    urlTemplate: url || 'http://36.2.11.90:8883/tile?get=map&cache=off&x={x}&y={y}&z={z}&lid=traffic_gd',
    opacity: 1
  });

  layer.on('layerload', () => {
    const _name: string = new Date().getTime() + '.png';
    const out = fs.createWriteStream(resolve(`../images/${_name}`));
    const stream = canvas.pngStream();
    stream.on('data', function(chunk) {
      out.write(chunk);
    });

    stream.on('end', function() {
      console.log('saved png');
      ctx.status = 200;
      ctx.body = {
        code: 200,
        success: true,
        data: '加载成功'
      };
    });
  });

  map.addLayer(layer);
};

export default GetMap;
