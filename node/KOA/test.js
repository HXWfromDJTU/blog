const { Koa } = require('./index.js');


let koa = new Koa();


koa.use(async (ctx, next) => {
    console.log(1)
    // 处理后的ctx，继续传送给下一步
    next(ctx);
    console.log(ctx.body)
});

// 
koa.use(async (ctx, next) => {
    console.log(3)
    // await readfile();
    setTimeout(async () => {
        await next()
    }, 3000);
});

let readfile = function () {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log(4)
            resolve()
        }, 3000);
    })

}

// 模拟最终处理过程
koa.use((ctx, next) => {
    console.log(5)
    ctx.body = "Hello World!"
});


koa.listen(3001);
