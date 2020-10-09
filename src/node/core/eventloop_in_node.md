# Node 中的 eventloop

首先我们再审视一下libuv自身处于一个什么样的位置...

![](/blog_assets/node_libuv.png)
1️⃣ `nodeJS`底层使用的是`V8`的引擎，解析完基础的`nodeJS`代码之后，调用`Node Api`。
2️⃣ 

___



#### Pahse概述
![](/blog_assets/eventLoop_in_node.png)

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


___
### 参考文章
[Node.js eventLoop - Void Canvas](http://voidcanvas.com/nodejs-event-loop/)

[Node的事件循环机制 - segementfault](https://segmentfault.com/a/1190000013102056)




## 新笔记
##### 文件I/O的异步

##### 异步任务谁来执行？

##### 系统核数与线程池中线程数目的关系
* 线程池中默认的线程数目为四个

![](/blog_assets/node_cpp_primitives.png)   
![](/blog_assets/event_loop_center_dispatch.png)

### eventLoop 扮演一个请求事件的分发中心角色

### C++ tty module