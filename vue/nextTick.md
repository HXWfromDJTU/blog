### nextTick
 * `nextTick`函数是传入一个回调函数`callback`，使得回调函数中的内容，会放到下一个事件队列中执行。
 * vue源码使用`promise`、`setTimeout`等方法在`microtask`中创建异步事件，目的是在当前调用栈执行完毕以后，才回去执行这个事件(放到异步队列里)。
* 每一个`tick`中的每一次数据变化，都会对应一个`watcher`被收集到`nextTick`的`queue`中去，针对同一个数据，有多次变化，就有多个`watcher`被收纳
 * 但是同一个的 `Watcher` 在同一个`nextTick` 的时候应该只被执行一次，也就是说队列 `queue` 中不应该出现重复的 `Watcher` 对象。我们给每个`watcher`对象都标记上`id`，以辨别出相同的`watcher`，进而去除重复`watcher`
 * 这时候，我们使用一个`map`去实现同个`watcher`对象的去重，同一个`watcher`只执行一次。
* 每一次的数值变更，都会触发`watcher`对象的`update`方法，并且判断是否已加入到了队列，若没有则加入。(就像是，在银行排队办业务A。有人喊了你手中的号，你去排队了，后来你老公说我们还想要办业务B，这时候，明显你老公不需要另排一个队，而让你吧任务都执行了)
* `flushSchedulerQueue` 方法执行，清空将要执行的`queue`队列，执行每一个去重后的`watcher`对象上的`run`方法真正去刷新视图。 