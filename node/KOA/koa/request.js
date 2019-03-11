const url = require('url');

const request = {
    get url() { // 这样就可以用ctx.request.url上取值了，不用通过原生的req
        return this.req.url;
    },
    get path() {
        return url.parse(this.req.url).pathname;
    },
    get query() {
        return url.parse(this.req.url).query;
    },
    // 。。。。。。
};
module.exports = request;
