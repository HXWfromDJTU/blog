const http = require('http');
const Stream = require('stream'); // 引入stream
const EventEmitter = require('events');
const context = require('./context');
const request = require('./request');
const response = require('./response');








class Koa extends EventEmitter {
    constructor() {
        super();
        this.middlewares = []; // 需要一个数组将每个中间件按顺序存放起来
        this.context = context; // 将三个模块保存，全局的放到实例上
        this.request = request;
        this.response = response;
    }
    use(fn) {
        // this.fn = fn
        this.middlewares.push(fn); // 每次use，把当前回调函数存进数组
    }
    createContext(req, res) { // 这是核心，创建ctx
        // 使用Object.create方法是为了继承this.context但在增加属性时不影响原对象
        const ctx = Object.create(this.context);
        const request = ctx.request = Object.create(this.request);
        const response = ctx.response = Object.create(this.response);
        // 请仔细阅读以下眼花缭乱的操作，后面是有用的
        ctx.req = request.req = response.req = req;
        ctx.res = request.res = response.res = res;
        request.ctx = response.ctx = ctx;
        request.response = response;
        response.request = request;
        return ctx;
    }

    handleRequest(req, res) { // 创建一个处理请求的函数
        res.statusCode = 404; // 默认404
        const ctx = this.createContext(req, res); // 创建ctx
        // this.fn(ctx) // 调用用户给的回调，把ctx还给用户使用。
        const fn = this.composeMiddlewares(this.middlewares, ctx); // 调用compose，传入参数
        fn.then(() => { // then了之后再进行判断
            if (typeof ctx.body === 'object') {
                res.setHeader('Content-Type', 'application/json;charset=utf8');
                res.end(JSON.stringify(ctx.body));
            } else if (ctx.body instanceof Stream) {
                ctx.body.pipe(res);
            } else if (typeof ctx.body === 'string' || Buffer.isBuffer(ctx.body)) {
                res.setHeader('Content-Type', 'text/htmlcharset=utf8');
                res.end(ctx.body);
            } else {
                res.end('Not found');
            }
        }).catch((err) => { // 监控错误发射error，用于app.on('error', (err) =>{})
            this.emit('error', err);
            res.statusCode = 500;
            res.end('server error');
        });
    }
    async composeMiddlewares(middlewares, ctx) { // 简化版的compose，接收中间件数组、ctx对象作为参数
        function dispatch(index) { // 利用递归函数将各中间件串联起来依次调用
            if (index === middlewares.length) return; // 最后一次next不能执行，不然会报错
            const middleware = middlewares[index]; // 取当前应该被调用的函数
            return middleware(ctx, () => dispatch(index + 1)); // 调用并传入ctx和下一个将被调用的函数，用户next()时执行该函数
        }
        return dispatch(0);
    }
    listen(...args) {
        const server = http.createServer(this.handleRequest.bind(this));// 这里使用bind调用，以防this丢失
        // let server = http.createServer(this.fn) // 放入回调
        server.listen(...args); // 因为listen方法可能有多参数，所以这里直接解构所有参数就可以了
        console.log(`server is runing: listing ${args}`);
    }
}

module.exports = Koa;
