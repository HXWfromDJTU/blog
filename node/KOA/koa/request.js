const url = require('url'); // 引入 url 作为url处理工具。     

const request = {
    get url() {
        return this.req.url; // 接受委托，取出http原生对象上的url参数
    },
    get path() {
        return this.parse(this.req.url).pathname; // 接受委托，取出url参数，并且使用工具，获取到 pathname
    }
};




module.exports = request;