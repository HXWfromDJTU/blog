const { Koa } = require('./simpleKoa');


let koa = new Koa();


koa.use(async (ctx, next) => {
    console.log('第一个处理过程');
    // 处理后的ctx，继续传送给下一步
    await next(ctx);
});

koa.use((ctx, next) => {
    console.log('进入第二个处理过程，但需要等待');
    setTimeout(data => {
        console.log(`正式开始第二个过程`)
        next(ctx);
    })
});

koa.use((ctx, next) => {
    console.log('最后一个处理过程');
    next(ctx);
});


koa.listen(3001);
