const { Koa } = require('./simpleKoa');


let koa = new Koa();


koa.use((ctx, next) => {
    console.log('第一个处理过程');
    // 处理后的ctx，继续传送给下一步
    next(ctx);
});

koa.use((ctx, next) => {
    console.log('第二个处理过程');
    next(ctx);
});

koa.use((ctx, next) => {
    console.log('最后一个处理过程');
    next(ctx);
});



koa.listen(3001);
