## koa简述

koa核心分为四部分，分别是
* content上下文
* middleware中间件
* request请求
* response响应

### Middlewre
`koa`的中间件是一个一步函数，接受两个参数，分别是`ctx`和`next`，其中`ctx`是当前的请求上下文，`next`是下一个中间件，这样想来，我们需要维护一个中间件的数组，每次调用`app.use`就是往数组中`push`一个异步函数。
```js
use(middleware){
   this.middlewares.push(middleware)
}
```
每次有新的请求，我们都需要把这次请求的上下文灌进数组的每一个中间件里。需要使得每个中间件都能够通过`next`函数调用到下一个中间件。当我们调用`next`函数的时候，一般是不需要传参数的，而被调用的中间件中一定会接收到`ctx`和`next`两个参数。


比如我们在koa的升级版egg.js中，会看到这样的用法            
```js
const fn = async function() {
   // 使用同步的方式来书写异步的操作
  const user = await getUser();
  const posts = await fetchPosts(user.id); 
  return { user, posts };
};
fn().then(res => console.log(res)).catch(err => console.error(err.stack));
```






