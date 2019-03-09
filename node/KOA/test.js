const { Koa } = require('./index.js');


let koa = new Koa();


koa.use(async (ctx, next) => {
    console.log(1)
    // 处理后的ctx，继续传送给下一步
    let result = await next(ctx);
    console.log(result)
});

// 
koa.use(async (ctx, next) => {
    console.log(3)
    let result = await readfile();
    next();
    console.log(ctx.body)
    console.log(ctx)
});

let readfile = function () {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log(4)
            resolve('xxx')
        }, 3000);
    })

}

// 模拟最终处理过程
koa.use((ctx, next) => {
    console.log(5)
    ctx.res.body = "Hello World!"
});


koa.listen(3001);
