const http = require('http'); // 引入 http支持
// 引入三个基础模块
const context = require('./context');
const request = require('./request');
const response = require('./response');
// 引入流处理   
const Stream = require('stream');
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
        // 根据 用户的实际请求情况，根据我们的需求拼凑一个需要的上下文对象          
        let ctx = this.setContext(req, res);

        // 启动中间件的执行     
        let handler = this.compose(ctx, this.middlewares);

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
        })
    }
    /**
     * 处理中间件的执行过程      
     * @param {*} ctx 上下文对象
     * @param {*} middlewares 中间件对象
     */
    compose(ctx, middlewares) {
        function dispatch(index) {
            // 拦截式方法，若访问到最后一个中间件了，就返回一个resolved 状态的 promise   
            if (index === middlewares.length) {
                return Promise.resolve();
            }
            // 取出指定的中间件         
            const work = middlewares[index];
            // 取出下一个中间件作为promise的resolve回调      
            return Promise.resolve(
                work(ctx, () => {  // 注意：这里的第二个参数，就是我们中间件回调中的第二个参数 next ，用于启动下一个中间件       
                    dispatch(index + 1);  // 递归推动        
                })
            )
        }
        return dispatch(0); // 启动中间件任务      
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