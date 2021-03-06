## 概述
本文主要为Node.js工作原理解析，从我们编写的`Application`到`Node`,再到`v8编译解析`，也会聊聊大家比较关心的`Libuv`和`EventLoop`的6阶段，所以把之前拆分开的内容，汇总到一起便于大家整体理解。

其实每一个点都可以讲上一天，本文主要为大家理清楚这几个过程间的关系，很多细节则不多赘述。


## Node.js Framework
![](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/blog_assets/node_framework.png)  

##### 第一层(Javascript依赖包)
* Standard Libary 是我们日常项目常用的`HTTP` `Buffer`等模块  

##### 第二层(桥阶层)
* Node Binding 是沟通C++和Javascript的桥梁,封装了底层C与C++模块包，暴露出JavaScript接口给上层调用  

##### 第三层 (C/C++依赖包)
这一层是支撑 Node.js 运行的关键，由 C/C++ 实现
* V8不必多说相当于Nodejs的引擎(V8相关的笔记📒，[传送门](/node/v8/v8.md))

* libuv 填平了多个平台的对异步I/O的不同实现，在Win平台上则是直接使用IOCP代替转让部分的功能。 (libuv的笔记📒，[传送门](/node/core/libuv/libUV.md))

* `C-ares` 是使用C语言实现的一个异步`DNS`查找的一个底层库，著名的`Node.js` `curl` `gevent`都使用了`C-ares`作为底层

* `http_parser`、`OpenSSL`、`zlib`等模块实现了一些和网络请求封装有关的东西，比如说`http解析`、`SSL`和`数据压缩`。  

* 可以在node源码的`/deps`目录中找到都有哪些C/C++依赖![](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/blog_assets/node_source.png)

##### 第四层 操作系统
第三层的内容都是C/C++编写的依赖，在各操作系统平台下，都会直接调用系统`Api`去完成对应的任务。
___

了解了Node.js的整体架构后，不难发现架构中`第三层`中的各种`C/C++`依赖正是`Node.js`实现它的单线程黑魔法的关键所在，所以接下来就详细看看这些依赖们。

## V8
#### 编译
|引擎|处理流程|优缺点|
|---|---|---|
| 旧版v8 | JavaScript 代码 ---> AST ---> V8 直接执行这些未优化过的机器码 ---> 高频率过高的代码优化为机器码 | ①惰性编译，编译时间过久，影响代码启动速度   ②编译出的机器码通常为源JS代码大小的几千倍    ③使用内存、硬盘进行缓存在移动端内存占用问题明显 |
| 新版v8 | 源代码 ---> AST ---> 字节码 ---> 解释器执行字节码 | ①字节码占用空间远小于机器码，有效减少内存占用 ②将字节码转换为不同架构的二进制代码的工作量也会大大降低 ③引入字节码，使得V8 移植到不同的 CPU 架构平台更加容易 |

* ##### 字节码
   ① 解释器可以直接解释执行字节码。    
   ② 字节码是一种中间码，占用内存相较机器码小，不受cpu型号影响。
* ##### 机器码
   ① 机器码可以被cpu直接解读，运行速度快。
   ② 但是不同cpu有不同体系架构，也对应不同机器码。占用内存也较大。

#### 控制与执行
v8无论是在浏览器端还是Node.js环境下都会启用一个主线程`(浏览器中称为为UI线程)`，并且维护一个消息队列用于存放即将被执行的宏任务，若队列为空，则主线程也会被挂起。    

##### 宏任务
每个宏任务执行的时候，V8都会重新创建栈，所有的函数都会被压入栈中然后逐个执行，直到整个栈都被清空。

##### 微任务
微任务的出现，是为了在多个在粒度较大的宏任务之间穿插更多的操作。微任务可以看做是一个需要异步执行的函数，执行的时机在当前的宏任务的主代码快执行完之后，在整个宏任务执行结束之前。

通俗地理解，V8 会为每个宏任务维护一个微任务队列，生成一个微任务，该微任务会被 V8 自动添加进微任务队列，等整段代码快要执行结束时，该环境对象也随之被销毁，但是在销毁之前，V8 会先处理微任务队列中的微任务。

![](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/blog_assets/micro_task_know.png)

## libuv
`libuv` 是一个高性能的，事件驱动的`I/O`库，这个库负责各种回调函数的执行熟顺序。童鞋们熟知的`EventLoop`与`Thread Pool`都由`Libuv`实现。

![](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/blog_assets/node_libuv_dir.png)


在 `《图解 Google V8》`中有一段描述十分经典，这里直接引用一下
> Node 是 V8 的宿主，它会给 V8 提供事件循环和消息队列。在 Node 中，事件循环是由 libuv 提供的，libuv 工作在主线程中，它会从消息队列中取出事件，并在主线程上执行事件。 
同样，对于一些主线程上不适合处理的事件，比如消耗时间过久的网络资源下载、文件读写、设备访问等，Node 会提供很多线程来处理这些事件，我们把这些线程称为线程池。  

![](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/blog_assets/node_libuv.png)

拿文件读写操作来说，如上图libuv就会启用`Thread Pool`中的文件读写线程进行文件读写。读写完毕后，该线程会将读写的结果包装成函数的形式，塞入消息队列中等待主线程执行。


#### 关于线程池
* 耗时工作在工作线程完成，而工作的`callback`在主线程执行。
* 每一个`node`进程中，`libuv`都维护了一个线程池。
* 因为同处于一个进程，所以线程池中的所有线程都共享进程中的上线文。
* 线程池默认只有4个工作线程，用`UV_THREADPOOL_SIZE`常量控制。(翻译自[文章](https://link.juejin.im/?target=http%3A%2F%2Fvoidcanvas.com%2Fnodejs-event-loop%2F))
* 并不是所有的操作都会使用线程池进行处理，只有`文件读取`、`dns查询`与`用户制定使用额外线程`的会使用线程池。
（配图来自libuv团队的演讲）

  ![](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/blog_assets/libuv_thread_pool_only_for_file_io.png)

## EventLoop in Node.js
![](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/blog_assets/libuv_loop_official.png)

* 首先判断当前`loop`的状态，只有处于激活状态才会开始执行周期，若处于非激活状态，则什么都不需要做。
* 事件循环的职责，就是不断得等待事件的发生，然后将这个事件的所有处理器，以它们订阅这个事件的时间顺序，依次执行。当这个事件的所有处理器都被执行完毕之后，事件循环就会开始继续等待下一个事件的触发，不断往复。
* 即如果某个事件绑定了两个处理器，那么第二个处理器会在第一个处理器执行完毕后，才开始执行。

> ps: 重点看timers、poll、check这3个阶段就好，因为日常开发中的绝大部分异步任务都是在这3个阶段处理的。

#### 从源码中看 EventLoop
```c++
int uv_run(uv_loop_t* loop, uv_run_mode mode) {
  int timeout;
  int r;
  int ran_pending;

  /*
  从uv__loop_alive中我们知道event loop继续的条件是以下三者之一：
  1，有活跃的handles（libuv定义handle就是一些long-lived objects，例如tcp server这样）
  2，有活跃的request
  3，loop中的closing_handles
  */
  r = uv__loop_alive(loop);

  //  假若上述三个条件都不满足，则更新 loop 里的update_times
  if (!r)
    uv__update_time(loop);  // 更新 loop 实体的 time属性为当前时间

  while (r != 0 && loop->stop_flag == 0) {
    uv__update_time(loop); // 更新时间变量，这个变量在uv__run_timers中会用到
    uv__run_timers(loop); // 执行timers阶段
    ran_pending = uv__run_pending(loop);//从libuv的文档中可知，这个其实就是I/O callback阶段,ran_pending指示队列是否为空
    uv__run_idle(loop);//idle阶段
    uv__run_prepare(loop);//prepare阶段

    timeout = 0;

    /**
    设置poll阶段的超时时间，以下几种情况下超时会被设为0，这意味着此时poll阶段不会被阻塞，在下面的poll阶段我们还会详细讨论这个
    1，stop_flag不为0
    2，没有活跃的handles和request
    3，idle、I/O callback、close阶段的handle队列不为空
    否则，设为timer阶段的callback队列中，距离当前时间最近的那个
    **/    
    if ((mode == UV_RUN_ONCE && !ran_pending) || mode == UV_RUN_DEFAULT){
      timeout = uv_backend_timeout(loop); // 这个函数调用计算除了，I/O将会阻塞多少时间

      uv__io_poll(loop, timeout);//poll阶段
      uv__run_check(loop);//check阶段
      uv__run_closing_handles(loop);//close阶段
      //如果mode == UV_RUN_ONCE（意味着流程继续向前）时，在所有阶段结束后还会检查一次timers，这个的逻辑的原因不太明确
    
      if (mode == UV_RUN_ONCE) {
        uv__update_time(loop);
        uv__run_timers(loop);
      }

      r = uv__loop_alive(loop);
      if (mode == UV_RUN_ONCE || mode == UV_RUN_NOWAIT)
       break;
    }

    if (loop->stop_flag != 0) {
        loop->stop_flag = 0;
    }

    return r;
}
```
#### timers 阶段
* 一个`Node.js`的timer与`libuv`的timer阶段并不是一一对应的,若多个`Node.js`中的timer都到期了，则会在一个`libuv`的timer阶段所处理。
* 在指定的一段时间间隔后， 计时器回调将被尽可能早地运行。但是，操作系统调度或其它正在运行的回调可能会延迟它们。
* 此外，为了防止某个阶段任务太多，而使得后续的阶段出现饥饿的现象，会给每个阶段设置一个最大的回调数量，执行超过这个上限的回调数目之后，会自动跳出这个阶段,进入下一个阶段。

#### pending callbacks 阶段 (I/O Callback)
此阶段对某些系统操作（如 TCP 错误类型）执行回调。例如，如果 TCP 套接字在尝试连接时接收到 ECONNREFUSED，则某些 *nix 的系统希望等待报告错误。这将被排队以在 挂起的回调 阶段执行。   

#### idle 阶段 与 prepare 阶段
只在内部执行

#### poll 阶段
poll是整个消息循环中最重要的一个阶段，作用是等待异步请求和数据，文档原话是
>Acceptc new incomming connection( new socket establishment ect) and dat (file read etc)

在`Node.js`里，任何异步方法（除timer,close,setImmediate之外）完成时，都会将其callback加到poll queue里,并立即执行。

本阶段支撑了整个消息循环机制，主要做了两件事：
* 处理poll队列（poll quenue）的事件(callback)
* 执行timers的callback,当到达timers指定的时间时

poll整个阶段过程为:
* 如果event loop进入了 poll阶段，且代码未设定timer
  * 如果poll queue不为空，event loop将同步的执行queue里的callback,直至queue为空，或执行的callback到达系统上限
  * 如果poll queue为空，将会发生下面情况：
    * 如果代码已经被setImmediate()设定了callback, event loop将结束poll阶段进入check阶段，并执行check阶段的queue (check阶段的queue是 setImmediate设定的)
    * 如果代码没有设定setImmediate(callback)，event loop将阻塞在该阶段等待callbacks加入poll queue
* 如果event loop进入了 poll阶段，且代码设定了timer
  * 如果poll queue进入空状态时（即poll 阶段为空闲状态），event loop将检查timers,如果有1个或多个timers时间时间已经到达，event loop将按循环顺序进入 timers 阶段，并执行timer queue

![](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/blog_assets/libuv_poll_phase_diagram.png)

<!-- | 阶段 | 处理 |
|-- | -- |
| poll phase 执行 | `poll phase`首先会执行 `watch_queue` 队列中的`I/O`  一旦`watch_queue`中的队列空，则整个消息循环则会进入`sleep`(不同平台实现线程休眠的方法不一样)，从而等待被内核时间唤醒。|
| poll phase等待 | 简单来说首先会判断后面的 `check phase` 以及 `close phase`是否还有等待处理的回调。  如果有，则不等待，直接进入`check phase`。|
| poll phase 超时 | 如果没有其他回调等待执行，他会给`epoll` 方法设置一个`timeout`，等待一段时间，这段时间的长度一般是 `timer phase` 中最近要执行的回调启动时间，到现在的差值。 | -->

具体`epoll`的实现过程，可以参考另一篇笔记[Socket 编程 - I/O 多路复用](https://github.com/HXWfromDJTU/blog/issues/13)


#### check 阶段
这个阶段只处理`setImmediate`的回调函数  

因为`poll phase`阶段可能设置一些回调，希望在 `poll  phase`后运行，所以在`poll phase`后面增加了这个`check phase`

#### close callback 阶段
专门处理一些 close类型的回调，比如`socket.on('close',....)`，用于清理资源。


### libuv小结
* `Node.js`中`v8`借助`libuv`来实现异步工作的调度，使得主线程则不阻塞
* `libuv`中的`poll`阶段，主要封装了各平台的多路复用策略`epoll`/`kqueue`/`event ports`等，对`I/O`事件的等待和到达来驱动整个消息循环。
* 使用`Node.js`时，使用者是单线程的概念。但了解其`线程池`规则之后，我们仍可`隐式`地去使用`多线程`的特性，只是线程的调度完全交给了`Node.js`的内核。

![](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/blog_assets/libuv_deep_in.png)

## 更新
node 从 V11 版本开始，event loop 已经与浏览器趋于相同，即每个 macrotask 执行完之后，执行所有的 microtask


## 参考资料
[1] [NodeConf EU | A deep dive into libuv - Saul Ibarra Coretge](https://www.youtube.com/watch?v=sGTRmPiXD4Y)
[2] [libuv & Node.js EventLoop](https://mlib.wang/2020/03/01/v8-libuv-timer-event-loop/)
[3] [The Node.js Event Loop: Not So Single Threaded](https://www.youtube.com/watch?v=zphcsoSJMvM)
[4] [《图解 Google V8》](https://time.geekbang.org/column/article/224206)
[5] [Introduction to libuv: What's a Unicorn Velociraptor? - Colin Ihrig, Joyent](https://www.youtube.com/watch?v=_c51fcXRLGw)
[6] [Node.js 事件循环，定时器和 process.nextTick()](https://nodejs.org/zh-cn/docs/guides/event-loop-timers-and-nexttick/)


<!-- ## 其他概念理解
## 举例说明
#### 可以创建异步操作的动作

```js
setTimeout(() => {console.log(1)})

setImmediate(() => {console.log(2)})

process.nextTick(() => {console.log(3)})

Promise.resolve().then(() => {console.log(4)})

console.log(5)
```

```js
5
3
4
1
2
```

### setImmediate 与 setTimeout
先来看一个代码的执行情况
```js
setTimeout(function(){
   console.log('1');
},0)
setImmediate(function(){
  console.log('2')
})
```
![](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/blog_assets/setImmediate_timeout.png)  

##### 结合上面的 eventloop来说
1️⃣ `setTimeout`能够接受的最小时限是`4毫秒`(`setInterval`是10毫秒)，所以计算机接受到的数字是4毫秒  
2️⃣  当代码执行的时候，先进入eventloop的timmer阶段，若机器执行很慢，进入eventloop的时候已经超过了4毫秒，那么setTimeout的callback就会马上被执行。而机器性能比较好，4ms还没有到，那么就会进行到poll阶段的判断，发现`check phase`中有设定的`setimmediate`的回调，则会立即执行。  
3️⃣ 所以说`setImmediate`与`setTimout`的执行和代码执行的环境有很大的关系。  


### process.nextTick
process.nextTick 和 Vue的`this.$nextTick` 机制是类似的。
1️⃣ 我们知道 this.$nextTick是属于微任务，而微任务会在每一个宏任务结束的时候都需要清空所有的微任务  
2️⃣ process.nextTick也是一个微任务，而eventLoop中的每一个阶段都可以看做一个宏任，在每一个阶段产生的微任务，当然就要在下一个阶段执行之前执行清空执行完毕。 
```js
setTimeout(() => {
    console.log('timeout0');
    // 微任务
    process.nextTick(() => {
        console.log('nextTick1');
        // 微任务中的微任务
        process.nextTick(() => {
            console.log('nextTick2');
        });
    });
    process.nextTick(() => {
        console.log('nextTick3');
    });
    console.log('sync');
    // 新一层宏任务
    setTimeout(() => {
        console.log('timeout2');
    }, 0);
}, 0);
```
___
node的几个核心依赖模块

* I/O请求  根据平台不一样，使用不同的解决方案。
* File请求 所有平台则使用线程池的解决方案 -->
