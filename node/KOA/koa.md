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

但是我们的koa是不建议我们直接去修改这个内置的request对象的
![](/blog_assets/koa_3.png)


`ctx.state`用于承载各个中间件之间需要传递的参数。            

![](/blog_assets/koa_ctx_state.png)



#### next
next方法是代码执行下一步的唯一标准，无论是同步任务还是异步任务。若不是手动调用这个next方法，则表现出卡住了,而这里的卡住必须是使用,promise的方式去实现的.
```js
return Promise.resolve(
          work(ctx, () => {  // 注意：这里的第二个参数，就是我们中间件回调中的第二个参数 next ，用于启动下一个中间件       
               dispatch(index + 1);  // 递归推动        
            })
         )
```
这里的设计和一些路由守卫的设计有些类似，在`vue-router`中，不执行`beforeEach`中的`next()`回调，则无法进入对应的组件/页面一样。   


###### 为何一定要使用 Promise.resolve()     
Koa 规定只要遇到 next 就需要等待，则将取出每一个中间件函数执行后的结果使用 Promise.resolve 强行包装成一个成功态的 Promise，就对异步进行了兼容。        