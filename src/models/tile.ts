import axios from 'axios';

const login: any = async (ctx, next) => {
  try {
    const { appid, fun, lang } = ctx.query;
    const data = await axios.get('https://login.weixin.qq.com/jslogin', {
      params: {
        appid: appid,
        fun: fun,
        lang: lang,
        _: new Date().getTime()
      }
    });
    if (data.data) {
      ctx.status = 200;
      ctx.body = {
        code: 200,
        success: true,
        message: 'success',
        data: data.data
      };
    }
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
  login
};
