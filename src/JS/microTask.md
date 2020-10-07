| 任务类型 | 事件类型 |
| --- | --- | --- |
| 宏任务 | `setTimeOut` 、 `setInterval` 、 `setImmediate` 、 `I/O` 、 各种`callback`、 `UI渲染` 、`messageChannel`等  |
| 微任务 | `process.nextTick` 、`Promise`  、`MutationObserver` 、`async(实质上也是promise)`  |

## 微任务
### MutationObserver
>MutationObserver 接口提供了监视对DOM树所做的更改能力。它被设计为旧的MutationEvents功能的替代品。

`MutationObserver`是一个构造器，他能够在指定的`DOM`发生变化的时候被调用。

##### Api
`disconnect()`
阻止mutationObserver示例继续接收通知。直到再次调用`observe()`方法开启，该观察者对象包含的回调函数都不会被调用。

`observe()`
配置`MutationObserver`在`DOM`更改匹配给定选项时，通过其回调函数开始接收通知。

`takeRecords`
    从`MutationObserver`的通知队列中删除所有待处理的通知，并将它们返回到`MutationRecord`对象的新`Array`中。

实例
```js

// 获取目标DOM对象
let targetNode = document.querySelector(`#id`);

// 配置所需检测对象
let config = {
    attributes: true,
    childList: true,
    subtree: true
};

// 声明 DOM 变动后触发的回调函数
const mutationCallback = (mutationsList) => {
    for(let mutation of mutationsList) {
        // mutation.type 指向的是 配置项中被修改的项目名称
        let type = mutation.type;
        switch (type) {
            case "childList":
                console.log("childList被改动了");
                break;
            case "attributes":
                console.log(`${mutation.attributeName} 这个属性名称被改动了.`);
                break;
            case "subtree":
                console.log(`subTree这个属性被改动了`);
                break;
            default:
                break;
        }
    }
};

// 使用构造器，初始实例化 MutationObserer对象
let observer = new MutationObserver(mutationCallback);
// 开启监听属性，传入监听DOM对象，和需要监听的内容
observer.observe(targetNode, config);
```
##### 测试开始
```js
let div = document.createElement("div")
div.id = 'targetNode'
document.body.appendChild(div)
```
![](/blog_assets/mutationObserver.png)
```js
// 停止监听
observer.disconnect();
```

### process.nextTick
process.NextTick是nodeJS中的概念，在浏览器中并不能够使用哦，node官网[传送门:point_right:](http://nodejs.cn/api/process.html#process_process_nexttick_callback_args)
准备另开一篇文章：去学习node_eventLoop,[传送门:point_right:](/node/eventloop_in_node.md)

```js
console.log('start');
process.nextTick(() => {
  console.log('nextTick callback');
});
console.log('scheduled');

// start
// scheduled
// nextTick callback
```
注意：每次事件轮询后，在额外的`I/O`执行前，`next tick`队列都会优先执行。 递归调用`nextTick callbacks` 会阻塞任何I/O操作，就像一个`while(true);` 循环一样。



## 宏任务

### postMessage
##### 基本用法
```js
let ch = new MessageChannel()
let p1 = ch.port1;
let p2 = ch.port2;

p1.postMessage("你好我是 p1");
// port2 receive 你好我是 p1

p2.postMessage("这样啊，我是p2，吃了吗？")；
// port1 receive 这样啊，我是p2，吃了吗？
```
##### MDN 示例

```js
// 使用MessageChannel构造函数实例化了一个channel对象
var channel = new MessageChannel();
var para = document.querySelector('p');

// 获取到iframe对象    
var ifr = document.querySelector('iframe');
var otherWindow = ifr.contentWindow;

// 当iframe加载完毕
ifr.addEventListener("load", iframeLoaded, false);

// 我们使用MessagePort.postMessage方法把一条消息和MessageChannel.port2传递给iframe
function iframeLoaded() {
  otherWindow.postMessage('Hello from the main page!', '*', [channel.port2]);
}

// 
channel.port1.onmessage = handleMessage;
function handleMessage(e) {
  para.innerHTML = e.data;
}
```
##### webworker
> 后来笔者在工作使用到了service-worker帮助进行排序计算，所以补充一下，主页面和worker之间的通信也是是用了 MessageChannel 机制进行实现
```js
// page.js
let worker = new Worker('./counting.js');
worker.postMessage({id:666})
worker.on('message',result=>{
   rending(result); // 渲染结果
})

// counting.js
self.on('message',message=>{
   let result = countintMethod(message.id);
   self.postMessage(result);
})
```
这样至少有一个好处就是能够不阻塞浏览器UI的渲染，让另一个进程去帮助我们进行计算，然后异步渲染。

### setTimeout、setInterval、setImmediate
几个定时器属于宏任务这个不多说。简单提一下`setImmediate`，它相当于`setTimeout(fn,0)`，一般我们会将他用于把某个任务提取到异步的形式执行，而不阻塞当前任务。

### requestAnimationFrame - 不是宏任务的任务
> window.requestAnimationFrame() 告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行 --- MDN

严格意义上来说，raf并不是一个宏任务，因为
* 执行时机和宏任务完全不一致。
* raf任务队列被执行的时候，会将其此刻队列中所有的任务都执行完。

但是查阅了[相关规范](https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model)之后，我们可以知道`一个eventLoop的完整过程是包含这浏览器的渲染过程的`，再根据上面`raf`的定义可以知道，ref的执行会在一个`eventLoop`中的微任务结束后，下一个`eventloop`开始前去执行。

![](/blog_assets/raf_eventloop.png)

### 参考文章
[1] [MessageChannel](https://github.com/jabez128/jabez128.github.io/issues/11)     
[2] [MutationObserver - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver)     
[3] [MutationObserver的使用 - 掘金](https://juejin.im/post/5b18e6606fb9a01e5c45434c)     
[4] [requestAnimationFrame是一个宏任务么](https://ginobilee.github.io/blog/2019/02/01/requestAnimationFrame%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AE%8F%E4%BB%BB%E5%8A%A1%E4%B9%88/)     
[5] [Living Standard — Last Updated 6 October 2020](https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model)     
