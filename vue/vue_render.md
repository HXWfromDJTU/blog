# Vue Render 相关的知识补充

* VNode
 V-node是用json格式来保存数据节点信息的方法。用来储存一个节点的信息。

 * Virtual Dom
 virtual dom 是 Vode 组成的一个 虚拟节点树，实质上也是用JS对象取存储节点信息的集合。

 * render fucntion 是由 template 模板 通过complie而得到的
     * parse
       会首先将传入 的template 字符串，使用复杂的正则表达式将模板转化成 AST(抽象语法树)
    * optimize 优化阶段
       * isStatic 用于标记是否为静态节点
       * markStatic  用于标记
       * markStaticRoots 用于标记静态根节点
    * generate 最终得到 render 的字符串以及 staticRenderFns的字符串

* patch
   * differ 算法
      * 只对同层节点进行比较
      * 非对树进行逐层式的遍历搜索
      * 时间复杂度只有 O(n) 
      比较过程：
      * oldVode 与 newVnode有一方为空的时候，另一方直接替换它
      * 若二者都不为空，则进行sameVnode判断，若标签更变了，则直接替换
      * 若sameVNode判断得到，没有更变。则进行 patchVnode比对。
         * 交叉比对
         * nodeOps 是一个适配层，根据不同平台提供的不同的操作 DOM 的方法，用于实现跨平台操作DOM
         * 
* `nextTick`
       是传入一个回调函数cb，使得回调函数中的内容，会放到下一个事件队列中执行。
       * 每一个tick中的数据变化，都会对应一个watcher被收集到nextTick的queue中去，针对同一个数据，有多次变化，就有多个watcher被收纳
       * 但是同一个的 Watcher 在同一个 下一个tick 的时候应该只被执行一次，也就是说队列 queue 中不应该出现重复的 Watcher 对象。这时候，我们使用一个map去实现同个watcher对象的去重，同一个watcher只执行一次。
       * 每一次的数值变更，都会触发watcher对象的update方法，更新监控的值，并且判断是否已加入到了队列，若没有则加入。
       * flushSchedulerQueue 方法执行，清空将要执行的queue队列，执行每一个去重后的watcher对象上的run方法真正去刷新视图。 