const { Koa } = require('./koa/index.js');
const fs = require('fs');
const { action1, action2, action3 } = require('./middlewares')
let koa = new Koa();


koa.use(action1);

// 
koa.use(action2);



// 模拟最终处理过程
koa.use(action3);


koa.listen(3001);
