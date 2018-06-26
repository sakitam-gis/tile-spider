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

const islogin: any = async (ctx, next) => {
  try {
    const { uuid, tip } = ctx.query;
    const data = await axios.get('https://login.weixin.qq.com/cgi-bin/mmwebwx-bin/login', {
      params: {
        tip: tip || 1,
        uuid: uuid,
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

const getlogin: any = async (ctx, next) => {
  try {
    const { url, fun } = ctx.query;
    const data = await axios.get(url, {
      params: {
        fun: fun || 'new'
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

const qrcode: any = async (ctx, next) => {
  try {
    const { uuid  } = ctx.query;
    const data = await axios.get(`https://login.weixin.qq.com/qrcode/${uuid}`, {
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Content-Type': 'image/jpeg',
        'Accept-Encoding': 'gzip, deflate, br'
      },
      params: {}
    });
    if (data.data) {
      ctx.status = 200;
      ctx.body = data.data;
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
  login,
  qrcode,
  islogin,
  getlogin
};
