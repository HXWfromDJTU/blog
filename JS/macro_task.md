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
#####MDN 示例

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
#### webworker
> 后来笔者在工作红使用到了service-worker帮助进行排序计算，所以补充一下，主页面和worker之间的通信也是是用了 MessageChannel 机制进行实现
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