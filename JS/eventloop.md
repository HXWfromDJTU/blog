# Javascript 的 EventLoop
![](/blog_assets/eventLoopTitle.png)
___
###   任务分类
#### 宏任务(macrotask)
* `setTimeOut` 、 `setInterval` 、 `setImmediate` 、 `I/O` 、 各种`callback`、`UI渲染等`
* 优先级： `主代码块` > `setImmediate` > `MessageChannel` > `setTimeOut`/`setInterval`
#### 微任务(microtask)
* `process.nextTick` 、`Promise`  、`MutationObserver` 、`async(实质上也是promise)`
* 优先级： `process.nextTick` > `Promise` > `MutationOberser`
___
### 执行分区
> 我们常常吧EventLoop中分为 内存、执行栈、WebApi、异步回调队列(包括微任务队列和宏任务队列)

![](/blog_assets/eventLoop_task.png) 
#### 执行栈
* 执行栈是宏任务被执行的地方

#### 宏任务 & 宏任务队列
* 宏任务总会在下一个`EventLoop`中执行
* 若在执行宏任务的过程中，加入了新的`微任务`，会把新的微任务添加到微任务的队列中。

#### 微任务 &  微任务队列
* 若在执行微任务的过程中，加入了新的微任务，会把新的微任务添加在当前任务队列的队尾巴。
* 微任务会在本轮`EventLoop`执行完后，马上把执行栈中的任务都执行完毕。

#### 执行流程
① `Javascript`内核加载代码到`执行栈`   
② `执行栈`依次执行主线程的`同步任务`，过程中若遇调用了异步Api则会添加回调事件到`回调队列`中。且`微任务`事件添加到微任务队列中，`宏任务`事件添加到宏任务队列中去。直到当前`执行栈`中代码执行完毕。    
③ 开始执行当前所有`微任务队列`中的微任务回调事件。    (:smirk:注意是所有哦，相当于清空队列)    
④ 取出`宏任务队列`中的第一条(先进先出原则哦)宏任务，放到`执行栈`中执行。    
⑤  执行当前`执行栈`中的宏任务，若此过程总又再遇到`微任务`或者`宏任务`，继续把`微任务`和`宏任务`进行各自队伍的`入队`操作，然后本轮的`宏任务`执行完后，又把本轮产生的`微任务`一次性出队都执行了。    
⑥ 以上操作往复循环...就是我们平时说的`eventLoop`了

....特点是
* 微任务队列操作，总是会一次性清空队列
* 宏任务队列每次只会取出一条任务到执行栈中执行

### 辅助理解
```js
let promiseGlobal = new Promise(resolve=>{
  console.log(1)
  resolve('2')
})
console.log(3) 

promiseGlobal.then(data=>{
  console.log(data)
  let setTimeoutInner = setTimeout(_=>{
  console.log(4)
   },1000)
   let promiseInner =new Promise(resolve=>{
     console.log(5) 
      resolve(6)
    }).then(data=>{
     console.log(data)
   })
})
let setTimeoutGlobal = setTimeout(_=>{
  console.log(7);
 let promiseInGlobalTimeout = new Promise(resolve=>{
      console.log(8); 
      resolve(9)
  }).then(data=>{
     console.log(data)
  })
},1000) 
```
建议不要直接拷贝到 控制台跑...大家先想想:smirk:

#### 过程动画
![](/blog_assets/eventLoopGif1.gif)
![](/blog_assets/eventLoopGif2.gif)

#### 答案
> 1 3 2  4 5 6  __ 等待一秒___  7 8  9 4 

           

___
### 常见的问题
* Q: 我的`setTimeout`函数到时间了，为啥一直不去执行。
   A: `setTimeOut`的回调会被放到任务队列中，需要当前的执行栈执行完了，才会去执行执行任务队列中的内容。出现`setTimeout`回调不及时，说明在执行栈中出现了阻塞，或者说执行代码过多。

* 常见的`vue.$nextTick`会把事件直接插入到当前`微任务`队列的中
____
### 相关文章
[实现异步的Api](../ES6/async_await_conding.md)
