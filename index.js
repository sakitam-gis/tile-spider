const Canvas = require('canvas');
const fs = require('fs');
const canvas = new Canvas(256, 256);
const ctx = canvas.getContext('2d');
const Image = Canvas.Image;
const axios = require('axios');
axios({
  method: 'get',
  url: 'http://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x=12&y=6&z=4',
  responseType: 'arraybuffer'
  // responseType: 'stream'
}).then((response) => {
  const img = new Image();
  img.src = response.data;
  // img.src = new ArrayBuffer([response.data]);
  ctx.drawImage(img, 0, 0, img.width, img.height);
  canvas.createPNGStream().pipe(fs.createWriteStream(__dirname + '/images/res.png'));
}).catch(error => {
  console.log(error)
})
// fs.readFile(__dirname + '/images/2.png', function(err, squid){
//   if (err) throw err;
//   console.log(squid)
//   const img = new Image();
//   img.src = squid;
//   ctx.drawImage(img, 0, 0, img.width, img.height);
//   canvas.createPNGStream().pipe(fs.createWriteStream(__dirname + '/images/res.png'));
// });
