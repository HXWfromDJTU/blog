const http = require('http'); // 引入 http支持
// 引入三个基础模块
const context = require('./context');
const request = require('./request');
const response = require('./response');
/**
 * @class koa 
 */
class Koa {
    constructor() {
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
     * 内部方法，取出下一个任务。并且执行。
     */
    _next(ctx) {
        // 取出中间件    
        const callbacks = this.middlewares;
        if (callbacks.length === 0) return;// 执行栈清空，停止执行
        let work = callbacks.shift(); // 取出第一个处理过程

        // 执行函数，并且向外暴露 上下文对象 和 next操作
        work.apply(this, [ctx, this._next.bind(this)]);
    }
    /**
     * 创建上下文对象
     * @param {*} req 请求对象
     * @param {*} res 返回对象
     */
    setContext(req, res) {
        // 将组装好的对象挂载到 context 属性上。           
        let ctx = {
            request: {
                ...this.request,
                req,
                res,
            },
            response: {
                ...this.response,
                req,
                res,
            },
            app: this, // 应用程序实例引用     
            originUrl: '',
            res,  // 原生的res对象
            req,  // 原生的req对象
            socket: Socket,
            state: {} // 各个中间件之间的数据传递     
        }
        return ctx;
    }
    handleRequest(req, res) {
        // 根据 用户的实际请求情况，创造出一个请求    
        let ctx = this.setContext(req, res);
        // 将 上下文和 中间件合并
        this.compose(ctx, this.middlewares);
    }
    compose() {

    }
    /**
     * 监听端口号
     * @param {Number} port 需要被监听的端口号
     */
    listen(port) {
        // 初始化的时候创建一个http服务器     
        this.server = Koa.http.createServer(this.handleRequest.bind(this));
        // 监听端口     
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