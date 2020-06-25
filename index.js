const Koa = require('koa');
const app = new Koa();
const koaBody = require('koa-body');
const Router = require('koa-router');
const fs = require('fs');
const path = require('path');
var os = require('os');
const cp = require('child_process')
const axios = require('axios').default;

app.use(async (ctx, next) => {
  // 允许来自所有域名请求
  // ctx.set("Access-Control-Allow-Origin", "http://localhost:7778");
  // ctx.set("Access-Control-Allow-Origin", "http://localhost:7778");
  ctx.set('Access-Control-Allow-Origin', ctx.req.headers.origin)

  // 设置所允许的HTTP请求方法
  ctx.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");

  // 字段是必需的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段.
  ctx.set("Access-Control-Allow-Headers", "x-requested-with, accept, origin, Content-Type");

  // 服务器收到请求以后，检查了Origin、Access-Control-Request-Method和Access-Control-Request-Headers字段以后，确认允许跨源请求，就可以做出回应。

  // Content-Type表示具体请求中的媒体类型信息
  // ctx.set("Content-Type", "application/json;charset=utf-8,multipart/form-data");

  // 该字段可选。它的值是一个布尔值，表示是否允许发送Cookie。默认情况下，Cookie不包括在CORS请求之中。
  // 当设置成允许请求携带cookie时，需要保证"Access-Control-Allow-Origin"是服务器有的域名，而不能是"*";
  ctx.set("Access-Control-Allow-Credentials", true);

  // 该字段可选，用来指定本次预检请求的有效期，单位为秒。
  // 当请求方法是PUT或DELETE等特殊方法或者Content-Type字段的类型是application/json时，服务器会提前发送一次请求进行验证
  // 下面的的设置只本次验证的有效时间，即在该时间段内服务端可以不用进行验证
  ctx.set("Access-Control-Max-Age", 3000);

  /*
  CORS请求时，XMLHttpRequest对象的getResponseHeader()方法只能拿到6个基本字段：
      Cache-Control、
      Content-Language、
      Content-Type、
      Expires、
      Last-Modified、
      Pragma。
  */
  // 需要获取其他字段时，使用Access-Control-Expose-Headers，
  // getResponseHeader('myData')可以返回我们所需的值
  //https://www.rails365.net/articles/cors-jin-jie-expose-headers-wu
  // ctx.set("Access-Control-Expose-Headers", "myData");

  /* 解决OPTIONS请求 */
  if (ctx.method == 'OPTIONS') {
    ctx.body = '';
    ctx.status = 204;
  } else {
    await next();
  }
})

app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 200 * 1024 * 1024	// 设置上传文件大小最大限制，默认2M
  }
}));

const router = new Router();

router.post("/wh", async (ctx, next) => {
  console.log("start deploy");
  cp.execFile(path.join(__dirname, "./deploy.sh"), async (error, stdout, stderr) => {
    if (error) {
      await axios.get(`http://api.dodream.wang:5700/send_group_msg?group_id=152904742&message=${encodeURI("钩子部署失败")}\n${error.message}`);
      ctx.body = {
        msg: error.message
      }
    }
    if (stderr) {
      await axios.get(`http://api.dodream.wang:5700/send_group_msg?group_id=152904742&message=${stderr}`);
      ctx.body = {
        msg: stderr
      }
      console.log(stderr);
    }
    await axios.get(`http://api.dodream.wang:5700/send_group_msg?group_id=152904742&message=${encodeURI("钩子部署成功")}\n${stdout}`);

    console.log(stdout);
    console.log('部署成功')
    cp.execSync("pm2 restart hook")
  })
  ctx.body = {
    msg: 'deploy success!'
  }
});


router.post("/blogwh", async (ctx, next) => {
  console.log("start deploy");
  cp.execFile(path.join(__dirname, "./web.sh"),async (error, stdout, stderr) => {
    if (error) {
      await axios.get(`http://api.dodream.wang:5700/send_group_msg?group_id=152904742&message=${encodeURI("博客部署失败")}\n${error.message}`);
      ctx.body = {
        msg: error.message
      }
    }
    if (stderr) {
      await axios.get(`http://api.dodream.wang:5700/send_group_msg?group_id=152904742&message=stderr:${stderr}`);
      ctx.body = {
        msg: stderr
      }
      console.log(stderr);
    }
    await axios.get(`http://api.dodream.wang:5700/send_group_msg?group_id=152904742&message=${encodeURI("博客部署成功")}\n${stdout}`);

    console.log(stdout);
    console.log('部署成功')
  })

  ctx.body = {
    msg: 'blog success!'
  }
});

router.post("/webserverwh", async (ctx, next) => {
  console.log("start deploy");
  cp.execFile(path.join(__dirname, "./web.sh"), (error, stdout, stderr) => {
    if (error) {
      await axios.get(`http://api.dodream.wang:5700/send_group_msg?group_id=152904742&message=${encodeURI("后台部署失败")}\n${error.message}`);
      ctx.body = {
        msg: error.message
      }
    }
    if (stderr) {
      await axios.get(`http://api.dodream.wang:5700/send_group_msg?group_id=152904742&message=stderr:${stderr}`);
      ctx.body = {
        msg: stderr
      }
      console.log(stderr);
    }
    await axios.get(`http://api.dodream.wang:5700/send_group_msg?group_id=152904742&message=${encodeURI("后台部署成功")}\n${stdout}`);

    console.log(stdout);
    console.log('部署成功')
    cp.execSync("pm2 restart app")
  })

  ctx.body = {
    msg: 'blog success!'
  }
});

app.use(router.routes());


app.listen(3700, () => {
  console.log("listening on 3700")
});
