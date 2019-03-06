const http = require('http');

class Koa {
    constructor() {
        // 中间件队列
        this.middlewares = [];
        this.context = Object.create(null);
        this.request = Object.create(null);
        this.response = Object.create(null);
        // 初始化的时候创建一个http服务器
        this.server = Koa.http.createServer(ctx => {
            // console.log(ctx)
            this._flush(ctx);
        });
    }
    /**
     * 插入中间件
     * @param {*} fn 中间件对象
     */
    use(fn) {
        this.middlewares.push(fn);
    }
    /**
     * 当请求到来的时候，我们清空任务队列中的内容
     */
    _flush(ctx) {
        const callbacks = this.middlewares;
        let next = null;
        callbacks.map(cb => {
            cb(ctx, next)
        })
    }
    /**
     * 创建上下文对象
     * @param {*} req 请求对象
     * @param {*} res 返回对象
     */
    createContext(req, res) {
        let ctx = this.context;
        // 使用req和res来装饰 ctx 对象
        ctx.request = this.request;
        ctx.response = this.response;
        ctx.req = this.request.req = req;
        ctx.res = this.response.res = res;
        return ctx;
    }
    /**
     * 
     * @param {Number} port 需要被监听的端口号
     */
    listen(port) {
        if (typeof port === 'number' && port > 0 && port < 65535) {
            this.server.listen(port);
        } else {
            throw new Error(`${port}端口号无效，请输入一个有效的端口号......`);
        }
    }
}
// 模拟实现一个Koa   
Koa.http = http;

exports.Koa = Koa;