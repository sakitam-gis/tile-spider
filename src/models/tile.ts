import TileLayer from '../helper/TileGenerate';

const getTile: any = async (ctx, next) => {
  try {
    const { url, resolution } = ctx.query;
    const layer = new TileLayer({
      url: url,
      projection: 'EPSG:3857',
      resolution: Number(resolution)
    });
    const res = await layer.render();
    ctx.status = 200;
    ctx.body = {
      code: 200,
      success: true,
      message: 'error tiles',
      data: res.filter(item => !item['isLoad'])
    };
    next();
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      code: 500,
      success: false,
      message: error,
      data: []
    };
  }
};

export {
  getTile
};
