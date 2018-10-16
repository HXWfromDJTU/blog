## node 中的 eventloop

![](/blog_assets/eventLoop_in_node.png)
* nodeJS使用的是V8的引擎，解析完基础的nodeJS代码之后，调用Node Api。
* 这里使用到官方内置的`libuv`这个库，可以实现将不同的任务分配给不同的线程，形成一个`EventLoop`
* 不同的线程执行的结果，以异步的形式返回给V8引擎再去做处理

___
### nodejs六阶段

#### timer
使用一个for循环执行所有的 `setTimeout`,`setInterval`的回调，源码在此。[传送门>>](https://github.com/libuv/libuv/blob/9ed3ed5fcb3f19eccd3d29848ae2ff0cfd577de9/src/unix/timer.c#L150)
![](/blog_assets/node_timer.png)

这些回调都会被存入一个最小堆(min heap)中，这样引擎只需要每次判断头元素，如果符合条件就拿出来执行，知道遇到一个不符合条件或者队列空了才结束`time phase`
>最小堆，是一种经过排序的完全二叉树，其中任一非终端节点的数据值均不大于其左子节点和右子节点的值。

此外，nodejs为了防止某个`Pahse`任务太多，而使得后续的Pahse发饥饿的现象，会给每个Phase设置一个最大的回调数量，执行超过这个上限的回调数目之后，会自动跳出这个Pahse,进入下一个Pahse。
#### pending I/O Callback
这一阶段会执行 `fs.read`，`socket`等IN操作的回调函数，同时也包括各种`error`的回调

理论上来说，`poll`阶段会被`timer`阶段代码的执行所阻塞。

处理上一轮残留的`I/O`操作
#### idle,prrepare 
只在内部执行

#### poll 
这个是整个消息循环中最重要的一个 Phase ，作用是等待异步请求和数据，文档原话是
>Acceptc new incomming connection( new socket establishment ect) and dat (file read etc)

说他最重要是因为他支撑了整个消息循环机制，`poll phase`首先会执行 `watch_queue` 队列中的`I/O`，一旦`watch_queue`中的队列空，则整个消息循环则会进入`sleep`(不同平台实现线程休眠的方法不一样)，从而等待被内核时间唤醒。

Poll Phase不会一直等待下去
#### check
setImmediate的回调
#### close callback
关闭的回调

每个`eventLoop阶段`都有一个先进先出的`执行栈`



nodejs 具有事件驱动和非阻塞单线程的特点，使相关应用变得轻量和高效，当应用程序需要相关I/O操作的时候，线程并不会阻塞，而是把I/O移交给底层类库，libuv。此时nodejs线程会去处理其他的任务，当底层库处理完相关的I/O的操作后，会将主动权再次交给nodejs线程，因此event loop的祈祷的就是线程调度的作用，如当底层类库处理I/O操作后调度`nodejs``单线程处理后续的工作。

也就是说当`nodejs`启动的时候，它会开启一个`event loop`以实现异步调度`api`调度、schedule timer、回调`process.nextTick()`

虽然`nodejs`是单线程，但`libuv`在底层实现的时候，仍然是多线程。

### libUV
我们在`node`使用的时候，对使用者是单线程的概念，但在底层`node`使用了一个`libUV`的C++库去模拟了这个单线程的过程。

事实上在`libUV`内部也有`thread pool`的概念，在第三方的异步处理时候使用，比如`文件读取`、`跨域访问`、`dns查询`等等，都是使用线程池来处理的，默认使用4个线程。（翻译自[文章](https://link.juejin.im/?target=http%3A%2F%2Fvoidcanvas.com%2Fnodejs-event-loop%2F)）

在libUV这一层实际上是有个线程池辅助完成一些工作的。


___
### 参考文章
[Node.js eventLoop - Void Canvas](http://voidcanvas.com/nodejs-event-loop/)