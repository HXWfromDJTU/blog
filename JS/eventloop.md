# Javascript 的 EventLoop

##  (Macrotask) 弘任务 与 (Microtask) 微任务
### 弘任务
* `setTimeOut` 、 `setInterval` 、 `setImmediate` 、 `I/O` 、 各种`callback`、`UI渲染等`
* 优先级： `主代码块` > `setImmediate` > `MessageChannel` > `setTimeOut`/`setInterval`
### 微任务
* `process.nextTick` 、`Promise`  、`MutationObserver` 
* 优先级： `process.nextTick` > `Promise` > `MutationOberser`
### 执行先后
* 弘任务总会在下一个`EventLoop`中执行
* 微任务会在本轮`EventLoop`执行完后，马上把执行栈中的任务都执行完毕，
* 若在执行微任务的过程中，加入了新的微任务，会把新的微任务家在当前任务栈的队尾巴顺序执行，而不需要等到下一个EventLoop

## 执行栈(excute stack) 与 任务队列 (task queue)
* 同步的任务会被放到这个执行栈中依次执行
* 异步任务会被放到任务队列中执行，执行完后会在任务对客户总打上一个标记
* 当执行栈中的任务都执行完了，内核会去执行队列中的事件。

## 常见的问题
* Q: 我的`setTimeout`函数到时间了，为啥一直不去执行。

   A: `setTimeOut`的回调会被放到任务队列中，需要当前的执行栈执行完了，才会去执行执行任务队列中的内容。出现`setTimeout`回调不及时，说明在执行栈中出现了阻塞，或者说执行代码过多。

* 常见的`vue.$nextTick`会把事件直接插入到当前执行栈的末尾

## nodeJS 的异步实现
* nodeJS使用的是V8的引擎，解析完基础的nodeJS代码之后，调用Node Api。
* 这里使用到官方内置的`libuv`这个库，可以实现将不同的任务分配给不同的线程，形成一个`EventLoop`
* 不同的线程执行的结果，以异步的形式返回给V8引擎再去做处理

[实现异步的方法](../ES6/async_await_conding.md)
