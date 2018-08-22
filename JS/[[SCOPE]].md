# SCOPE
>  Javascript 的作用域链
###  js作用域链
* 开始执行的时候，作用域链上只有全局对象，并保存在内部属性`[[SCOPE]]`上。
* 调用某个函数的时候，会取出之前存有全局对象的`[[scope]]`，并把当前函数的活动对象，追加到取出的全局对象中，形成新的作用域链，再次存入`[[SCOPE]]`。
参考文档 https://blog.csdn.net/q1056843325/article/details/53086893?locationNum=12&fps=1