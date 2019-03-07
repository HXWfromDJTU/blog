const { Koa } = require('./simpleKoa');


let koa = new Koa();


koa.use(async (ctx, next) => {
    //console.log(ctx);
    // 处理后的ctx，继续传送给下一步
    await next(ctx);
    console.log(ctx.body)
});

koa.use((ctx, next) => {
    ctx.abc = 123;
    next(ctx);
    console.log('第二个过程的后续')
});

// 模拟最终处理过程
koa.use((ctx, next) => {
    ctx.body = "Hello World!"
});


koa.listen(3001);
