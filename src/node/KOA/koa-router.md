
### 简单的路由模拟  
基于我们之前的koa设计，我们可以轻松地在上下文对象ctx中，获取到请求的路径信息path，并且进行手工判断，以实现一个最简陋的“路由”。    

```js
app.use(async ctx => {
  if (ctx.path === '/mypage' && ctx.method === 'get') {
    ctx.body = 'This is my page~~~';
  } else {
    ctx.status = 404;
    ctx.body = 'Not Found';
  }
});
```

___
### 参考文档 

[koa-router 官方文档](https://github.com/ZijianHe/koa-router/tree/master#module_koa-router--Router+routes)   

[模拟一个简单的 koa-router](https://www.jianshu.com/p/7bf7f1368293)
 
[koa-router简明教程](https://www.jmjc.tech/less/120)