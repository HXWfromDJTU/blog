const http = require('http'); // 引入 http支持
// 引入三个基础模块
const context = require('./context');
const request = require('./request');
const response = require('./response');
// 引入流处理   
const Stream = require('stream');
// 引入EE事件处理模块     
const EventEmitter = require('events');
/**
 * @class koa 
 */
class Koa extends EventEmitter {  // 这里继承 EE 模块，令koa对象可以监听/触发事件     
    constructor() {
        super()
        // 中间件队列
        this.middlewares = [];
        // 根据引入的三个基本模块,创建对象     
        this.context = Object.create(context);
        this.request = Object.create(request);
        this.response = Object.create(response);
    }
    /**
     * 插入中间件
     * @param {*} fn 中间件对象
     */
    use(fn) {
        this.middlewares.push(fn);
    }
    /**
     * 创建上下文对象
     * @param {*} req 请求对象
     * @param {*} res 返回对象
     */
    setContext(req, res) {
        // 将组装好的对象挂载到 context 属性上。           
        let ctx = this.context;

        ctx.request = this.request;
        ctx.response = this.response;

        ctx.req = ctx.request.req = ctx.response.req = req;
        ctx.res = ctx.response.res = ctx.request.res = res;

        ctx.app = this;  // 应用程序实例引用        
        ctx.originUrl = '';
        ctx.state = {};  // 各个中间件之间的数据传递     

        return ctx;
    }
    /**
     * 处理请求的方法
     * @param {*} req 请求对象
     * @param {*} res 相应对象
     */
    handleRequest(req, res) {
        res.statusCode = 404; // 默认返回状态码 是 404

        // 根据 用户的实际请求情况，根据我们的需求拼凑一个需要的上下文对象          
        let ctx = this.setContext(req, res);

        // 启动中间件的执行     
        let handler = this.compose(ctx, this.middlewares);
        console.log(handler)
        // 根据不同的body返回类型，进行不同的处理
        handler.then(_ => {
            console.log('---', ctx.body)
            // 处理是流的情况
            if (Buffer.isBuffer(ctx.body) || typeof ctx.body === 'string') {
                res.setHeader('Content-Type', 'text/plain;chartset=utf8');
                res.end(ctx.body);
            } else if (typeof ctx.body === 'object') {
                // 处理是json对象的情况   
                res.setHeader('Content-Type', 'application/json;chartset=utf8');
                res.end(JSON.stringify(ctx.body));
            } else if (ctx.body instanceof Stream) {
                // 处理是文件流的情况     
                ctx.body.pipe(res);
            } else {
                res.end('404 Not Found');
            }
        }).catch(err => {
            this.emit('err', err); // 向外暴露事件
            res.statusCode = 500; // 表示内部错误
            res.end('Internal Server Error')
        })
    }
    /**
     * 处理中间件的执行过程      
     * @param {*} ctx 上下文对象
     * @param {*} middlewares 中间件对象
     */
    async compose(ctx, middlewares) { // 简化版的compose，接收中间件数组、ctx对象作为参数
        function dispatch(index) { // 利用递归函数将各中间件串联起来依次调用
            if (index === middlewares.length) return; // 最后一次next不能执行，不然会报错
            const middleware = middlewares[index]; // 取当前应该被调用的函数
            return middleware(ctx, () => dispatch(index + 1)); // 调用并传入ctx和下一个将被调用的函数，用户next()时执行该函数
        }
        return dispatch(0);
    }
    /**
     * 监听端口号    
     * @param {Number} port 需要被监听的端口号
     */
    listen(port) {
        // 初始化的时候创建一个http服务器     
        this.server = http.createServer(this.handleRequest.bind(this));
        // 监听端口     
        if (typeof port === 'number' && port > 0 && port < 65535) {
            this.server.listen(port);
        } else {
            throw new Error(`${port}端口号无效，请输入一个有效的端口号......`);
        }
    }
}

exports.Koa = Koa;