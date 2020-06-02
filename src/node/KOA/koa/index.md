
koa 原理解读





Koa-compose 与 Redux 与 vue-router守卫 实现上的异同点
* 看上去都有 next() 的机制

前面的一些类型判断语句也就不做过多描述。
```js
if (!Array.isArray(middlewares)) throw new TypeError('Middlewares must be an array')
  for (const fn of middlewares) {
    if (typeof fn !== 'function') {
      throw new TypeError('item of middlewares must be an functions')
    }
  }
```

##### 第一阶段 - 递归与洋葱模型
* 是一个作用是将所有的中间件串联起来，包装成一个函数，并且返回。这里要使用高阶函数
* 递归就是天然的洋葱模型实现
```js
 return function (context) {
    function dispatch(i) {
      let fn = middlewares[i] // ① 取出当前的中间件，fn指向每一个中间件
      if (!fn) return // ④ 为递归设定终结条件
      fn(context)   // ② 执行当前中间件
      return dispatch(i + 1)// ③ 形成初步的递归调用
    }
    return dispatch(0) // ④ 设定一个递归启动点
 }
```
```js
// 简单准备第三个中间件
const mid1 = () => console.log('mid1')
const mid2 = () => console.log('mid2')
const mid3 = () => console.log('mid3')

const fnx = compose([mid1, mid2, mid3]) 
fnx() // mid3 mid2 mid1
```
##### 第二阶段 - 支持异步
* 使用`next`表示开启下个中间件的函数句柄
* 使用 `bind`对`dispatch`进行函数改造
```js
 return function (context, next) {
    function dispatch(i) {
      let fn = middlewares[i]
      if (!fn) return
      // ⑤ 改造当前中间件执行时传入的参数，将下一个中间件的含数句柄，作为第二个参数 next 传入
      return fn(context, dispatch.bind(null, i + 1))
    }
    return dispatch(0)
 }
```
```js
const mid1 =  (ctx, next) => {
   console.log('mid1')
  setTimeout(()=>{
    console.log('mid1 wait for 2s')
    next()
}, 2000)
   console.log('mid1 after')
}
const mid2 = (ctx, next) => {
   console.log('mid2')
   setTimeout(()=>{
     console.log('mid2 wait for 2s')
     next()
    },2000)
   console.log('mid2 after')
}
const mid3 = function (ctx, next) {
   console.log('mid3')
   console.log('mid3 after')
}

const fnx = compose([mid1, mid2, mid3]) 
fnx() // 输出结果我就不写了，你猜猜是什么
```

##### 第三阶段 - 支持 async/await 转为同步写法
研究清楚第二阶段的测试输出后，我们将`mid1`改为,想要`mid2`执行完了再回来执行`mid1 after`
```js
const mid1 = async (ctx, next) => {
   console.log('mid1')
    await next()
   console.log('mid1 after')
}
```
我们则需要继续添加对`Promise`的支持

```js
 return function (context, next) {
    function dispatch(i) {
      let fn = middlewares[i]
      if (i === middlewares.length) fn = next
      if (!fn) return Promise.resolve()
      // ⑤ 改造当前中间件执行时传入的参数，将下一个中间件的含数句柄，作为第二个参数 next 传入
      return Promise.resolve(fn(context, dispatch.bind(null, i + 1)))
    }
    return dispatch(0)
 }
```

要是大家还是不太明白上面写法的原理，那我们来看看`compose` 组合 `middlewares`后的结果会是什么样子。

```js
const [mid1, mid2, mid3] = middlewares
// compose 可以理解为
const fnMiddleware = function(ctx) {
  return Promise.resolve(
    mid1(ctx, function next () {
     return Promise.resolve(
       mid2(ctx, function next () {
          return Promise.resolve(
            mid3(ctx, function next() {
              return Promise.resolve()
           }) 
         )
       })
     )
   })
 )
}
```


![](/blog_assets/koa-hand-by-hand.png)

![](/blog_assets/koa-official.png)
