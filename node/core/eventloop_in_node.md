## node 中的 eventloop

![](/blog_assets/eventLoop_in_node.png)
___
![](/blog_assets/node_libuv.png)
1️⃣ `nodeJS`底层使用的是`V8`的引擎，解析完基础的`nodeJS`代码之后，调用`Node Api`。
2️⃣  这里使用到官方内置的`libuv`这个库，可以实现将不同的任务分配给不同的线程，形成一个`EventLoop`
3️⃣ 不同的线程执行的结果，以异步的形式返回给`V8`引擎再去做处理

___

#### Timer
使用一个`for`循环执行所有的 `setTimeout`,`setInterval`的回调，源码在此。[传送门>>](https://github.com/libuv/libuv/blob/9ed3ed5fcb3f19eccd3d29848ae2ff0cfd577de9/src/unix/timer.c#L150)

这些回调都会被存入一个最小堆(min heap)中，这样引擎只需要每次判断头元素，如果符合条件就拿出来执行，知道遇到一个不符合条件或者队列空了才结束`time phase`
>最小堆，是一种经过排序的完全二叉树，其中任一非终端节点的数据值均不大于其左子节点和右子节点的值。这里不使用队列来实现，是因为timeout的callback是按照设置的时间长短来排列先后而调用的，并不是先进先出的逻辑队列。

此外，nodejs为了防止某个`Pahse`任务太多，而使得后续的Pahse发饥饿的现象，会给每个Phase设置一个最大的回调数量，执行超过这个上限的回调数目之后，会自动跳出这个Pahse,进入下一个Pahse。

#### pending I/O Callback
这一阶段会执行 `fs.read`，`socket`等`IO`操作的回调函数
同时也包括各种`error`的回调

理论上来说，`poll`阶段会被`timer`阶段代码的执行所阻塞。

处理上一轮残留的`I/O`操作

#### idle,prepare 
只在内部执行

#### poll 
这个是整个消息循环中最重要的一个 Phase ，作用是等待异步请求和数据，文档原话是
>Acceptc new incomming connection( new socket establishment ect) and dat (file read etc)

说他最重要是因为他支撑了整个消息循环机制，`poll phase`首先会执行 `watch_queue` 队列中的`I/O`，一旦`watch_queue`中的队列空，则整个消息循环则会进入`sleep`(不同平台实现线程休眠的方法不一样)，从而等待被内核时间唤醒。

`Poll Phase`不会一直等待下去，它有着精妙的设计，简单来说
他首先会判断后面的 `check phase` 以及 `close phase`是否还有等待处理的回调，如果有，则不等待，直接进入下一个`phase`。
如果没有其他回调等待执行，他回给`epoll` 方法设置一个`timeout`，等待一段时间，这段时间的长度一般是 `timer phase` 中最近要执行的回调启动时间，到现在的差值。

在这里 `poll phase` 最多等待上述时长。

若此期间，有事件唤醒了消息循环，那么就继续下一个`phase`的工作。
若此期间，没有发生任何事情，那么`timeout`后，消息循环依然要进入后面的 `phase`，让下一个迭代的`Timer Phase`也能够执行

`nodejs`就是通过 `poll phase`对`I/O`事件的等待和内核异步事件的到达来驱动整个消息循环的。


#### check
这个阶段只处理`setImmediate`的回调函数
因为`poll phase`阶段可能设置一些回调，希望在 `poll  phase`后运行，所以在`poll phase`后面增加了这个`check phase`

#### close callback
专门处理一些 close类型的回调，不如 socket.on('close',....)，用于清理资源。


每个`eventLoop阶段`都有一个先进先出的`执行栈`
#### Pahse概述
六个阶段顺序执行，源码[传送门](https://github.com/libuv/libuv/blob/v1.x/src/unix/core.c#L359)
```c
  while (r != 0 && loop->stop_flag == 0) {
    uv__update_time(loop); // 更新时间变量，这个变量在 uv__run_timers中会用到
    uv__run_timers(loop);   // 执行 timer 阶段
    ran_pending = uv__run_pending(loop);  // 从 libuv 的文档中可知，这个其实就是 I/O callback阶段，返回的 ran_pending 表明队列是否为空
    uv__run_idle(loop);  // idle阶段
    uv__run_prepare(loop);  // prepare阶段

    //.....  计算poll阶段的休眠时间 timeout

    uv__io_poll(loop, timeout);//poll阶段
    uv__run_check(loop);//check阶段
    uv__run_closing_handles(loop);//close阶段
     //如果mode == UV_RUN_ONCE（意味着流程继续向前）时，在所有阶段结束后还会检查一次timers
       if (mode == UV_RUN_ONCE) {
      uv__update_time(loop);
      uv__run_timers(loop);
    }
}
```



### setImmediate 与 setTimeout
![](/blog_assets/setImmediate_timeout.png)

`nodejs` 具有事件驱动和非阻塞单线程的特点，使相关应用变得轻量和高效，当应用程序需要相关I/O操作的时候，线程并不会阻塞，而是把I/O移交给底层类库，libuv。

此时nodejs线程会去处理其他的任务，当底层库处理完相关的`I/O`的操作后，会将主动权再次交给`nodejs`线程，因此`event loop`起到的就是线程调度的作用，如当底层类库处理`I/O`操作后调度`nodejs`单线程处理后续的工作。

也就是说当`nodejs`启动的时候，它会开启一个`event loop`以实现异步调度`api`调度、`schedule timer`、回调`process.nextTick()`

虽然`nodejs`是单线程，但`libuv`在底层实现的时候，仍然是多线程。

### libUV
详细的libUV文章...[传送门](./libUV.md)。

我们在`node`使用的时候，对使用者是单线程的概念，但在底层`node`使用了一个`libUV`的C++库去模拟了这个单线程的过程。

事实上在`libUV`内部也有`thread pool`的概念，在第三方的异步处理时候使用，比如`文件读取`、`跨域访问`、`dns查询`等等，都是使用线程池来处理的，默认使用4个线程。（翻译自[文章](https://link.juejin.im/?target=http%3A%2F%2Fvoidcanvas.com%2Fnodejs-event-loop%2F)）

在`libUV`这一层实际上是有个线程池辅助完成一些工作的。

___
### 参考文章
[Node.js eventLoop - Void Canvas](http://voidcanvas.com/nodejs-event-loop/)

