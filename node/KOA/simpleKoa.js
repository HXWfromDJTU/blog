// 模拟实现一个Koa   

class Koa{
    constructor(){
        // 中间件队列
        this.middlewares = [];
        this.context = Object.create(context);
        this.request = Object.create(request);
        this.response = Object.create(response);
    }
    /**
     * 插入中间件
     * @param {*} fn 中间件对象
     */
    use(fn){
        this.middlewares.push(fn);
    }
    /**
     * 创建上下文对象
     * @param {*} req 请求对象
     * @param {*} res 返回对象
     */
    createContext(req,res){
        let ctx = this.context;  
        // 使用req和res来装饰 ctx 对象
        ctx.request = this.request;
        ctx.response = this.response; 
        ctx.req = this.request.req = req;
        ctx.res = this.response.res =res; 
        return ctx;
    }
}