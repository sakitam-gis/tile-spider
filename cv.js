const fs = require('fs');
const Canvas = require('canvas');
const maptalks = require('maptalks');
require('maptalks.node');
const canvas = new Canvas(10000, 20000);
const { Image } = require('canvas');
global.Image = Image;

const map = new maptalks.Map(canvas, {
  center: [116.0046413968285, 26.853333150317088],
  zoom: 12,
  spatialReference: {
    projection: 'EPSG:3857'
  }
});

const layer = new maptalks.TileLayer('gd', {
  urlTemplate: 'http://36.2.11.90:8883/tile?get=map&cache=off&x={x}&y={y}&z={z}&lid=traffic_gd',
  opacity: 1
});

layer.on('layerload', () => {
  const out = fs.createWriteStream(__dirname + '/canvas.png')
  const stream = canvas.pngStream();
  stream.on('data', function(chunk){
    out.write(chunk);
  });

  stream.on('end', function(){
    console.log('saved png');
  });
});

map.addLayer(layer);
