# 聊聊工作中遇到的Promise
Promise大家都很熟悉，ES 6规范嘛，resolve、reject、then、catch都烂熟于心，但是苦于工作中没有应用，也空是屠龙之技~

### Promise吃掉Error
##### 浏览器环境
浏览器执行Promise遇到错误，会打印出错误提示`ReferenceError: xxxxxx`，但是不会退出进程、终止脚本执行，2 秒之后还是会输出123。这就是说，`Promise` 内部的错误不会影响到 `Promise` 外部的代码，通俗的说法就是`Promise` 会吃掉错误”。
##### node环境
这个脚本放在服务器执行，退出码就是`0`（即表示执行成功）。不过，`Node` 有一个`unhandledRejection`事件，专门监听未捕获的`reject`错误，上面的脚本会触发这个事件的监听函数，可以在监听函数里面抛出错误。
```js
process.on('unhandledRejection', function (err, p) {
  throw err;
});
```
上面代码中，`unhandleRejection`的回调函数，有两个参数，错误对象本身 和 报错的 Promise对象实例。
不过在将来，node打算将Promise的Error等级提高为必须处理，否则抛出错误，停止程序的运行。