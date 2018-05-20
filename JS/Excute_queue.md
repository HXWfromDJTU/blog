## JS执行队列

* macrotask queue
 一般包括： `script`(整体代码),`setTimeout`, `setInterval`, `setImmediate`, `I/O`, `UI rendering`
* microtask queue
一般包括： `process.nextTick`, `Promises`, `Object.observe`, `MutationObserver`

### 执行过程
* JavaScript引擎首先从macrotask queue中取出第一个任务，
* 执行完毕后，将microtask queue中的所有任务取出，按顺序全部执行；
* 然后再从macrotask queue中取下一个，
* 执行完毕后，再次将microtask queue中的全部取出；
* 循环往复，直到两个queue中的任务都取完。

[参考资料](https://www.jianshu.com/p/3ed992529cfc)