### 理论层面
 * `nextTick`函数是传入一个回调函数`callback`，使得回调函数中的内容，会放到异步任务队列中执行。
 * vue源码使用`promise`、`setTimeout`等方法在`microtask`中创建异步事件，目的是在当前调用栈执行完毕以后，才回去执行这个事件(放到异步队列里)。 

关于 `macro task` 和 `micro task` 的概念，简单用代码表示，不细讲，有兴趣的去看另一篇文章...[传送门:point_right:](/JS/eventloop.md)
```js
for (macroTask of macroTaskQueue) {
    // 1. Handle current MACRO-TASK
    handleMacroTask();
      
    // 2. Handle all MICRO-TASK
    for (microTask of microTaskQueue) {
        handleMicroTask(microTask);
    }
}
```
___
### 源码层面
这是`vue`源码包中 用于实现 `nextTick` 的一个文件，想去看尤大神源码[摸我](https://github.com/vuejs/vue/blob/dev/src/core/util/next-tick.js)，以下是一些理解性注释
```js
import { noop } from 'shared/util'
import { handleError } from './error'
import { isIOS, isNative } from './env'

const callbacks = []
let pending = false

/*
* 备用工具函数，将压入数组中所有准备执行的函数，便利执行
*/
function flushCallbacks () {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}

let microTimerFunc; // 对应微任务的回调函数
let macroTimerFunc;  //对应宏任务的回调函数
let useMacroTask = false;  // 是否使用宏任务

/**
 * 这一段是对于 macro task 的实现
 * 优先检测是否支持原生 setImmediate，这是一个高版本 IE 和 Edge 才支持的特性，
 *不支持的话再去检测是否支持原生的 MessageChannel
 * 如果也不支持的话就会降级为 setTimeout 0
 * 注意：在宏任务分类的优先级中，也是  setImmeiate > MessageChannel  > setTimeout
 */
if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  macroTimerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else if (typeof MessageChannel !== 'undefined' && (
  isNative(MessageChannel) ||
  // PhantomJS
  MessageChannel.toString() === '[object MessageChannelConstructor]'
)) {
  const channel = new MessageChannel()
  const port = channel.port2;
  channel.port1.onmessage = flushCallbacks;
  macroTimerFunc = () => {
    port.postMessage(1)
  }
} else {
  macroTimerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}
/**
 * 这一段是对于 microtask 的实现
 */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  // 创建一个状态为 resolve的 promise 异步任务
  const p = Promise.resolve()
  // 创建微任务回调函数
  microTimerFunc = () => {
    p.then(flushCallbacks)
    // 对 iOS的兼容
    if (isIOS) setTimeout(noop)
  }
} else {
  // 要是 浏览器不支持 Promise 的话，只能用 宏任务 的方式去实现。
  microTimerFunc = macroTimerFunc
}

/**
 * 封装一个方法，在数据状态发生了改变的时候，
 * 用于确保这些改变会在下一个宏任务中执行，
 * 而不是在本次宏任务的微任务阶段执行DOM的更新。
 */
export function withMacroTask (fn: Function): Function {
  return fn._withTask || (fn._withTask = function () {
    useMacroTask = true;
    const res = fn.apply(null, arguments);
    useMacroTask = false;
    return res
  })
}
/* 
* 对外暴露的 nextTick主函数
*/
export function nextTick (cb?: Function, ctx?: Object) {
  let _resolve
  // 收集传入的 cb回调事件到 全局 callback 回调数组。
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  // 判断使用宏任务还是微任务去实现异步操作，默认使用微任务
  if (!pending) {
    pending = true
    if (useMacroTask) {
      macroTimerFunc()
    } else {
      microTimerFunc()
    }
  }
  // 当调用 $nextTick 方法的时候，如没有传入 cb 回调，则创建一个空回调的异步微任务
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}
```
代码中涉及的 `MessageChannel` 和 `setImmediate`稍后再细作了解
___
### 应用层面
#### 内部应用 withMacroTask
对外的暴露的 `widthMacroTask` 方法并没有暴露给用户使用，这个方法在vue内部事件机制`platforms\web\runtime\modules\event.js` 管理器中有应用。
比如对于一些 `DOM` 交互事件，如 `v-on` 绑定的事件回调函数的处理，会强制走 `macro task`。
```js
import { withMacroTask, isIE, supportsPassive } from 'core/util/index'
// 节选部分
function add (
  event: string,
  handler: Function,
  once: boolean,
  capture: boolean,
  passive: boolean
) {
  handler = withMacroTask(handler)
  if (once) handler = createOnceHandler(handler, event, capture)
  target.addEventListener(
    event,
    handler,
    supportsPassive
      ? { capture, passive }
      : capture
  )
}
```
#### vue DOM 更新机制
请去看另一篇笔记[传送门 :point_right: ](/vue/vue_dom_nextTick.md)

#### 开发者应用场景
>  官方api

`Vue.nextTick( [callback, context] )`参数：
  *  `{Function} [callback]`
  *  `{Object} [context]`

这就是我们平时在开发的过程中，比如从服务端接口去获取数据的时候，数据做了修改，如果我们的某些方法去依赖了数据修改后的 `DOM` 变化，我们就必须在 `nextTick` 后执行
```js
Api.getData(data)
.then(()=>{
    this.treeNode = data.treeNode; 
    this.$nextTick(()=>{
        this.currentNode = this.
    })
})
```
___
### 小实验①
根据上面的知识点去想想,`DOM`被更新了几次？
```html
<template>
  <div id="app">
    <img src="./assets/logo.png">
    <h1>{{ msg }}</h1>
    <h2>val 当前值为 {{val}} </h2>
    <h3> val 被 vue 修改了 {{count }} 次</h3>
  </div>
</template>
```
```js
export default {
  name: 'app',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      val: 0,
      count: 0,
    }
  },
  mounted() {
    this.val = 333;
    this.$nextTick(_ => {
      this.val = 444;
    })
    this.$nextTick(_ => {
      this.val = 555;
    })
    setTimeout(() => {
      for (let i = 2000; i < 3000; i++) {
        this.val = i;
      }
    }, 3000)
  },
  watch: {
    val(newVal, oldVal) {
      this.count += 1;
      console.log("val  is changed")
    }
  }
}
```
##### 结果过程
![](/blog_assets/NEXT_TICK.gif)
___
### 小实验②
若把上一个实验的`script`部分改为如下内容，猜猜结果是如何呢？
```js
export default {
  name: 'app',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      val: 0,
      count: 0,
    }
  },
  beforeMount() {
    console.log(111)
    this.val = 111;
    this.$nextTick(_ => {
      console.log(222)
      this.val = 222;
    })
  },
  mounted() {
    console.log(333)
    this.val = 333;
    this.$nextTick(_ => {
      console.log(444)
      this.val = 444;
    })
    this.$nextTick(_ => {
      console.log(555)
      this.val = 555;
    })
    setTimeout(() => {
      for (let i = 2000; i < 3000; i++) {
        this.val = i;
      }
    }, 3000)
  },
  watch: {
    val(newVal, oldVal) {
      this.count += 1;
      console.log("val  is changed")
    }
  }
}
```
###### 输出结果 
![](/blog_assets/vue_nextTick_demo2.png)

说明同步修改不分生命周期，都会在第一个`eventLoop`中进行，而`$nextTick`也不区分生命周期，都会在本轮执行栈的`微任务阶段`完成修改。


