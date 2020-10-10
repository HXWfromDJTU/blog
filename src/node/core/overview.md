## 概述
本文主要为Node.js工作原理解析，从我们编写的`Application`到`Node`,再到`v8编译解析`，也会聊聊大家比较关心的`Libuv`和`EventLoop`的6阶段，所以把之前拆分开的内容，汇总到一起便于大家整体理解。

其实每一个点都可以讲上一天，本文主要为大家理清楚这几个过程间的关系，很多细节则不多赘述。


## Node.js Framework
![](/blog_assets/node_framework.png)  

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

* 可以在node源码的`/deps`目录中找到都有哪些C/C++依赖![](/blog_assets/node_source.png)

##### 第四层 操作系统
第三层的内容都是C/C++编写的依赖，在各操作系统平台下，都会直接调用系统`Api`去完成对应的任务。
___

了解了Node.js的整体架构后，不难发现架构中`第三层`中的各种`C/C++`依赖正是`Node.js`实现它的单线程黑魔法的关键所在，所以接下来就详细看看这些依赖们。

## V8

|引擎|处理流程|优缺点|
|---|---|---|
| 旧版v8 | JavaScript 代码 ---> 抽象语法树(AST) ---> V8 直接执行这些未优化过的机器码，保证了执行的速度 ---> 出现频率过高的代码，优化为机器码 | ①惰性编译，编译时间过久，影响代码启动速度   ②编译出的机器码通常为源JS代码大小的几千倍    ③使用内存、硬盘进行缓存在移动端内存占用问题明显 |
| 新版v8 | 源代码 ---> 抽象语法树 ---(解释器)---> 字节码 ------> JIT ---> 本地代码| ①字节码占用空间远小于机器码，有效减少内存占用 ②将字节码转换为不同架构的二进制代码的工作量也会大大降低 ③引入字节码，使得V8 移植到不同的 CPU 架构平台更加容易 |

* 字节码: 字节码是一种中间码，占用内存相较机器码小，不受cpu型号影响。
* 机器码: 机器码可以被cpu直接解读，运行速度快。但是不同cpu有不同体系架构，也对应不同机器码。占用内存也较大。


## libuv
`libuv` 是一个高性能的，事件驱动的`I/O`库，这个库负责各种回调函数的执行熟顺序。童鞋们熟知的`EventLoop`与`Thread Pool`都由`Libuv`实现。

![](/blog_assets/node_libuv_dir.png)
* 这里使用到官方内置的`libuv`这个库，可以实现将不同的任务分配给不同的线程，形成一个`EventLoop`
* 不同的线程执行的结果，以异步的形式返回给`V8`引擎再去做处理

* libUV提供了一个跨平台的抽象，由平台决定`Network I/O`在操作系统(服务器)层面实现，若是win平台则直接调用平台的IOCP机制，若是其他系统(unix)上则结合自行封装的`uv_io_t`实体去兼容各个平台，实现`异步Network I/O`。   

![](/blog_assets/node_libuv.png)

`nextTick` 和 `Promise` 都是微任务，定时器类生成的都是宏任务，而宏任务其实只是为了区分`微任务`而存在的一个概念


epoll
kqueue

libUV提供了两种方式与eventLoop一起协同工作，一个是句柄，一个是请求。

句柄代表了一个长期存在的对象，这些对象当处于一个活跃的状态时候，能够执行特定的操作。
比如说，一个准备 prepare 句柄在活跃的时候，可以在每个循环中调用它的回调一次。
再具象来说，一个TCP服务句柄在每次有新连接的时候，都会调用它的链接回调函数。

请求一般代表短时操作，

#### 关于线程池
* 每一个个node进程中，libuv都维护了一个线程池(Thread Pool)。
* 因为同处于一个进程，所以线程池中的所有线程都共享进程中的上线文。
* 脚本执行过程总，每遇到一个异步任务，都会在线程池中抽取一个线程来执行这个任务。

1️⃣ 我们在`node`使用的时候，对使用者是单线程的概念，但在底层`node`使用了一个`libUV`的C++库去模拟了这个单线程的过程。

`nodejs` 具有事件驱动和非阻塞单线程的特点，使相关应用变得轻量和高效，当应用程序需要相关I/O操作的时候，线程并不会阻塞，而是把I/O移交给底层类库，libuv。

2️⃣ 事实上在`libUV`内部也有`thread pool`的概念，在第三方的异步处理时候使用，比如`文件读取`、`跨域访问`、`dns查询`等等，都是使用线程池来处理的，默认使用4个线程。（翻译自[文章](https://link.juejin.im/?target=http%3A%2F%2Fvoidcanvas.com%2Fnodejs-event-loop%2F)）

## EventLoop in Node.js
![](/blog_assets/node_event_loop_phase.png)
1️⃣ 事件循环的职责，就是不断得等待事件的发生，然后将这个事件的所有处理器，以它们订阅这个事件的时间顺序，依次执行。当这个事件的所有处理器都被执行完毕之后，事件循环就会开始继续等待下一个事件的触发，不断往复。

2️⃣ 即如果某个事件绑定了两个处理器，那么第二个处理器会在第一个处理器执行完毕后，才开始执行。

3️⃣ 在这个事件的所有处理器都执行完毕之前，事件循环不会去检查是否有新的事件触发。

### 源码中的eventLoop
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
    uv__update_time(loop);//更新时间变量，这个变量在uv__run_timers中会用到
    uv__run_timers(loop);//timers阶段
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
    if ((mode == UV_RUN_ONCE && !ran_pending) || mode == UV_RUN_DEFAULT)
      timeout = uv_backend_timeout(loop);

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

  if (loop->stop_flag != 0)
    loop->stop_flag = 0;

  return r;
}
```

### EventLoop 阶段解析
### timers
1️⃣ 使用一个`for`循环执行所有的 `setTimeout` , `setInterval`的回调。
源码在此。[传送门>>](https://github.com/libuv/libuv/blob/9ed3ed5fcb3f19eccd3d29848ae2ff0cfd577de9/src/unix/timer.c#L150)

2️⃣ 这些回调都会被存入一个最小堆(min heap)中，这样引擎只需要每次判断头元素，如果符合条件就拿出来执行，直到遇到一个不符合条件或者队列空了才结束`time phase`
![](/blog_assets/min_set.png)
>最小堆，是一种经过排序的完全二叉树，其中任一非终端节点的数据值均不大于其左子节点和右子节点的值。这里不使用队列来实现，是因为timeout的callback是按照设置的时间长短来排列先后而调用的，并不是先进先出的逻辑队列。

3️⃣ 此外，`nodejs`为了防止某个`Pahse`任务太多，而使得后续的Pahse发饥饿的现象，会给每个`Phase`设置一个最大的回调数量，执行超过这个上限的回调数目之后，会自动跳出这个`Pahse`,进入下一个`Pahse`。

### pending callbacks (I/O Callback)
* 这一阶段会执行 `fs.read`，`socket`等`I/O`操作的回调函数   
* 同时也包括各种`error`的回调    
* 处理上一轮残留的`I/O`操作  
* 理论上来说，`poll`阶段会被`timers`阶段代码的执行所阻塞。   

### idle,prepare 
只在内部执行

### poll 
这个是整个消息循环中最重要的一个 Phase ，作用是等待异步请求和数据，文档原话是
>Acceptc new incomming connection( new socket establishment ect) and dat (file read etc)

说他最重要是因为他支撑了整个消息循环机制  

##### 1️⃣ poll phase 执行
☎️ `poll phase`首先会执行 `watch_queue` 队列中的`I/O`  
☎️ 一旦`watch_queue`中的队列空，则整个消息循环则会进入`sleep`(不同平台实现线程休眠的方法不一样)，从而等待被内核时间唤醒。(深入理解笔记📒[传送门](/node/core/node_io.md))

##### 2️⃣ Poll phase等待
☎️ 简单来说首先会判断后面的 `check phase` 以及 `close phase`是否还有等待处理的回调。  
☎️ 如果有，则不等待，直接进入`check phase`。     

##### 3️⃣ Poll phase 超时
☎️ 如果没有其他回调等待执行，他会给`epoll` 方法设置一个`timeout`，等待一段时间，这段时间的长度一般是 `timer phase` 中最近要执行的回调启动时间，到现在的差值。

☎️ 在这里 `poll phase` 最多等待上述时长。若此期间，有事件唤醒了消息循环，那么就继续下一个`phase`的工作。

☎️ 若此期间，没有发生任何事情，那么`timeout`后，消息循环依然要进入后面的 `phase`，让下一个`eventloop` 的 `Timer Phase`也能够执行

##### 总结
`nodejs`就是通过 `poll phase`对`I/O`事件的等待和内核异步事件的到达来驱动整个消息循环的。


### check phase
1️⃣ 这个阶段只处理`setImmediate`的回调函数  

因为`poll phase`阶段可能设置一些回调，希望在 `poll  phase`后运行，所以在`poll phase`后面增加了这个`check phase`

### close callback
1️⃣ 专门处理一些 close类型的回调，比如`socket.on('close',....)`，用于清理资源。



## 其他概念理解
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
![](/blog_assets/setImmediate_timeout.png)  

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
结果...em 自行运行看啊看吧...
___
node的几个核心依赖模块

* I/O请求  根据平台不一样，使用不同的解决方案。
* File请求 所有平台则使用线程池的解决方案