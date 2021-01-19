const Koa = require('koa');
const app = new Koa();
const koaBody = require('koa-body');
const Router = require('koa-router');
const fs = require('fs');
const path = require('path');
var os = require('os');
const cp = require('child_process');
const axios = require('axios').default;
const crypto = require('crypto');
const routerFun = require("./router");
const github = require("./github");

app.use(async (ctx, next) => {
  // 允许来自所有域名请求
  // ctx.set("Access-Control-Allow-Origin", "http://localhost:7778");
  // ctx.set("Access-Control-Allow-Origin", "http://localhost:7778");
  ctx.set('Access-Control-Allow-Origin', ctx.req.headers.origin);

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
});

app.use(koaBody());

async function sendMsg(msg) {
  //http://idayer.com/node-js-hmac-hash-sha256/
  const timestamp = Date.now();
  const secret = "SEC3dd3692c7231b78baaaabfbe13f54a2adbde1a38d920c59f6992cff40a915627";
  const str = timestamp + "\n" + secret;
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(str);
  let sign = encodeURIComponent(hmac.digest('base64'));

  let url = `https://oapi.dingtalk.com/robot/send?access_token=640583ebbceb8dae5aa91ddde448979b7aedbb500e882dfcc0f36df4569872d8&timestamp=${timestamp}&sign=${sign}`;
  axios.post(url, {
    "msgtype": "text",
    "text": {
      "content": msg
    }
  });
}

const router = new Router();
const platform = os.platform();

function auth() {
  cp.execSync("cd /var/www/html/projects/WebHook");
  cp.execSync("chmod 770 auth.sh");
  cp.execFileSync(path.join(__dirname, "./auth.sh"));
}

function IsLinux() {
  return platform === 'linux';
}

if (IsLinux())
  auth();

routerFun(router, "/wh", "./deploy.sh", "Webhook", "pm2 restart hook");

routerFun(router, "/blogwh", "./web.sh", "博客");

routerFun(router, "/webserverwh", "./webserver.sh", "后台", "pm2 restart app");
github(router, "/blog3d", "./blog3d.sh", "3d博客项目");

app.use(router.routes());

app.use(async ctx => {
  ctx.body = 'Hook服务已开启';
});

app.listen(3700, () => {
  console.log("listening on 3700");
});
