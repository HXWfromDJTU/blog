const { Koa } = require('./simpleKoa');


let koa = new Koa();


koa.use(ctx => {
    console.log('第一个处理过程');
});

koa.use(ctx => {
    console.log('第二个处理过程');
});

koa.use(ctx => {
    console.log(ctx);
});

koa.listen(3001);
