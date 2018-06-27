# tile-spider

> map tile download base on koa and node-canvas

## USE

```bash
git clone https://github.com/sakitam-gis/tile-spider.git
npm install
npm run lint
npm run build
npm run dev
```

## after

open http://localhost:3456/map/getTile

add Query Parameters

| param | inter | type | more |
| --- | --- | --- | --- |
| url | map service url | `String` | eg: http://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z} |
| resolution | layer resolution | `Number` | eg: 19567.87924100512 |

## result

you can see ``images`` folder.
