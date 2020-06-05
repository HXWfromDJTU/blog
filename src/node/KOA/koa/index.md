
# koa compose 解读

> koa-compose 作为koa实现中间件串联功能的关键函数，值得我们细细品味，话不多说先送上[👉源码](https://github.com/koajs/compose/blob/master/index.js)，别惊讶确实只有这么多行....


### 先撸一遍
```js
'use strict'

/**
 * Expose compositor.
 */
module.exports = compose

/**
 * Compose `middleware` returning
 * a fully valid middleware comprised
 * of all those which are passed.
 * 👉 原文译: 将所有中间件组合,返回一个包含所有传入中间件的函数
 *
 * @param {Array} middleware
 * @return {Function}
 * @api public
 */

function compose (middleware) {
  // 传入middware的必须为数组
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  // 任意数组元素也都必须为函数
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }

  // 返回一个每个中间件依次串联的函数闭包
  // 其实第一次调用 return fnMiddleware(ctx).then(handleResponse).catch(onerror); 时并没有传入第二个next参数，当然也传入不了
  return function (context, next) {
    // last called middleware #
    // 这里的 index 是用于防止在一个中间件中重复调用 next() 函数，初始值设置为 -1
    let index = -1

    // 启动递归，遍历所有中间件
    return dispatch(0)

    // 递归包装每一个中间件,并且统一输出一个 Promise 对象
    function dispatch (i) {
      // 注意随着 next() 执行，i、index + 1、当前中间件的执下标，在进入每个中间件的时候会相等
      // 每执行一次 next (或者dispatch) 上面三个值都会加 1

      /* 原理说明: 
       * 当一个中间件中调用了两次 next方法，第一次next调用完后，洋葱模型走完，index的值从 -1 变到了 middlewares.length,
       * 此时第一个某个中间件中的 next 再被调用，那么当时传入的 i + 1 的值，必定是 <= middlewares.length 的
       */
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))

      // 通过校验后，index 与 i 的值同步
      index = i

      // 取出一个中间件函数
      let fn = middleware[i]

      // 若执行到了最后一个，(其实此时的next也一定为undefined),我认为作者是为何配合下一句一起判断中间件的终结
      if (i === middleware.length) fn = next
      // 遍历到了最后一个中间件，则返回一个 resolve 状态的 Promise 对象
      if (!fn) return Promise.resolve()

      try {
        // 递归执行每一个中间件，当前中间件的 第二个 入参为下一个中间件的 函数句柄(此处用bind实现)
        // 这里注意：每一个 next 函数，都是下一个 dispatch函数，而这个函数永远会翻译一个 Promise 对象
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        // 中间件执行过程中出错的异常捕获
        return Promise.reject(err)
      }
    }
  }
}

```
## 拆解分析
#### 条件判断
前面的一些类型判断语句也就不做过多描述。
```js
if (!Array.isArray(middlewares)) throw new TypeError('Middlewares must be an array')
  for (const fn of middlewares) {
    if (typeof fn !== 'function') {
      throw new TypeError('item of middlewares must be an functions')
    }
  }
```

####  第一阶段 - 递归与洋葱模型
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

####  第二阶段 - 支持异步
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

#### 第三阶段 - 支持 async/await 转为同步写法
研究清楚第二阶段的测试输出后，我们基本将`异步中间件`串联起来。那么源码中，`dispatch`函数，无论走哪一个分支，为何一定都要返回一个`Promise`对象呢？   

想了好久不得其解，就把源码中返回`Promise`部分改为同步，跑了一下`koa`自带的测试用例。

```bat
# koa
$ npm run test
```

```js
 1) app.context
       should merge properties:
     Uncaught TypeError: Cannot read property 'then' of undefined
      at Application.handleRequest (lib/application.js:166:29)  // 👈👈 点开这里看了看
      at Server.handleRequest (lib/application.js:148:19)
      at parserOnIncoming (_http_server.js:779:12)
      at HTTPParser.parserOnHeadersComplete (_http_common.js:117:17)
      [use `--full-trace` to display the full stack trace]
```

```js
// application.js #line 160
  handleRequest(ctx, fnMiddleware) {
    const res = ctx.res;
    res.statusCode = 404;
    const onerror = err => ctx.onerror(err);
    const handleResponse = () => respond(ctx);
    onFinished(res, onerror);
    // 上面的错误堆栈，追踪到的就是这里 #line 166 👇👇👇 
    return fnMiddleware(ctx).then(handleResponse).catch(onerror);
  }

  // application.js #line 141
  callback() {
    const fn = compose(this.middleware);
    if (!this.listenerCount('error')) this.on('error', this.onerror);
    const handleRequest = (req, res) => {
      const ctx = this.createContext(req, res);
      return this.handleRequest(ctx, fn);
    };
    return handleRequest;
  }
```
不难看出抛出错误的`#line 161` fnMiddleware指的就是 `compose`之后的结果。说明在`koa`中，将所有中间件串联起来之后，希望得到的是一个`thenable`的对象。我们则需要继续添加对`Promise`的支持

```js
 return function (context, next) {
    function dispatch(i) {
      let fn = middlewares[i]
      if (i === middlewares.length) fn = next
      // ⑧ 调用最后一个中间件
      if (!fn) return Promise.resolve()
      try {
        // ⑥ 成功调用
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)))
      } catch (err) {
        // ⑦ 成功过程出错
        return Promise.resolve()
      }
      
    }
    return dispatch(0)
 }
```

### compose 结果

若还是不太明白上面写法的原理，那我们来看看`compose` 组合 `middlewares`后的结果会是什么样子。

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

### 参考资料
[Koa源码 - github](https://github.com/koajs/koa)   
[大家觉得 Koa 框架还有什么不足的地方吗？ - Starkwang的回答 - 知乎](https://www.zhihu.com/question/320893133/answer/660332567)       

