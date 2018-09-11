## node 中的 eventloop


* nodeJS使用的是V8的引擎，解析完基础的nodeJS代码之后，调用Node Api。
* 这里使用到官方内置的`libuv`这个库，可以实现将不同的任务分配给不同的线程，形成一个`EventLoop`
* 不同的线程执行的结果，以异步的形式返回给V8引擎再去做处理