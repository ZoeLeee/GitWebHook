const path = require('path');
var os = require('os');
const cp = require('child_process');
const { sendMsg } = require("./utils");

function IsLinux() {
    return os.platform() === 'linux';
}

module.exports = (router, api, sh, name, cmd) => {
    router.post(api, async (ctx, next) => {
        let body = ctx.request.body;
        let ref = body["default_branch"];
        let authorName = "";
        if (body["sender"] && body["sender"].login)
            authorName = body["sender"].login;

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