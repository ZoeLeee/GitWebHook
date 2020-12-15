const path = require('path');
var os = require('os');
const cp = require('child_process');
const axios = require('axios').default;
const crypto = require('crypto');

function IsLinux() {
    return os.platform() === 'linux';
}

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

module.exports = (router, api, sh, name, cmd) => {
    router.post(api, async (ctx, next) => {
        let body = ctx.request.body;
        let ref = body.ref.split("/").pop();
        let authorName = body["head_commit"].author.name;
        let isCreate = body.created;

        if (ref !== "master") {
            await sendMsg(`${authorName}${isCreate ? "创建了" : "更新了"}分支：${ref}`);
            return;
        }
        console.log("start deploy");
        await sendMsg(`${authorName}编译分支：${ref}`);
        if (!IsLinux()) {
            ctx.body = {
                msg: "本地测试"
            };
            return;
        }
        cp.execFile(path.join(__dirname, sh), async (error, stdout, stderr) => {
            if (error) {
                await sendMsg(name + "部署失败" + "\n" + error.message);
                ctx.body = {
                    msg: error.message
                };
            }
            if (stderr) {
                console.log(stderr);
            }
            await sendMsg(name + "部署成功");

            console.log(stdout);
            console.log('部署成功');
            if (cmd)
                cp.execSync(cmd);
        });

        ctx.body = {
            msg: name + "部署成功"
        };
    });
};