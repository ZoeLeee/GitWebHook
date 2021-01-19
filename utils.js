const axios = require('axios').default;
const crypto = require('crypto');

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

module.exports = {
    sendMsg
};