## 网络请求部分
##### 1️⃣ DNS缓存，预加载
`<meta pre-fetch>` 二级页面DNS预查询    

##### 2️⃣ 静态资源的压缩与合并
 js,css混淆压缩  
使用`gulp` `grunt` 或者 `webapck`等前端工具将多个js文件合并在一起     
图片使用雪碧图     

##### 3️⃣ 静态资源使用CDN加速    
CDN服务商可以再离用户最近的云服务器上，部署所需要的静态资源，然后发送给客户。

##### 4️⃣ 使用`key-css`    
在首页展示的时候，将首屏关键的css提取出来，并使用内嵌的形式加入页面，剩余部分使用外链的形式。  

##### 5️⃣ 使用http2.0   
HTTP 2.0改为使用单一TCP链接，数据的传输改为使用流的形式，充分利用了带宽，减少了RTT的次数。也消除了浏览器对同一个域下资源的同时请求只能存在6~8个的限制。（当然我们也可以在服务端，将不同的资源放在不同的服务器中）

##### 6️⃣ 增加HTTP缓存的使用   
强缓存可以有效地减少RTT次数，而协商缓存也能够有效地减少网络传输的负载。   

##### 7️⃣ 开启Gzip     
尽量减小数据包的大小 

##### 8️⃣ 合并多个接口  
将页面的多个接口在接入层进行合并，减少网络请求的次数。    

##### 9️⃣ 首屏使用SSR直出  
首屏数据直接结合DOM后，直接输出字符串到客户端，而不需要使用异步去请求数据。   


## 浏览器渲染部分 
#####  1️⃣ css提前，script沉底
因为浏览器的渲染规则，渲染页面需要CSS生成一个稳定的CSSOM，与DOM一起组成`Render Tree`。  

而`script`的下载和执行都会阻塞UI的渲染，所以一般将`script`标签放到DOM结构末尾。  
![rendingtree](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/blog_assets/rendingtree.png)  


##### 2️⃣ 减少DOM查询 
每一次我们使用选择器去获取DOM元素的时候，都需要经历一个查询的过程，时间不长，但是当批量操作出现的时候，耗时就变得可观了。
```js
let button = document.getElementByClassName('trigger-btn');
button.onclick = fucntion(){};
otherFun(button);
button.id = 'newId'; // 尽量复用前面的引用
```

##### 3️⃣ 整合批量操作DOM 
减少直接操作DOM的次数，也就是将DOM操作进行合并（使用`DocumentFragment`技术,mdn文档[传送门](https://developer.mozilla.org/zh-CN/docs/Web/API/DocumentFragment)👉

兼容性：`IE系列基本不支持` `Chrome>55` `FF>64`

![](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/blog_assets/WEB_OPTIMIZE_1.png)
原理就是这么个原理，但是经过大家的测试，貌似兼容性不太好，并且实验效果并没有提升多少效率，暂不推荐使用。


##### 4️⃣ 节流与防抖
事件节流，频繁频繁的事件，一点要做节流处理，避免js的执行阻塞UI操作。


##### 5️⃣ SSR直出  
若后端使用的是node，我们还可以在加载较慢的主页面中，使用`SSR`直接在node拼装好前端也买所需要的DOM和数据的结合体，直接交给浏览器渲染，而不用通过前端异步请求数据去渲染数据。有效减少RTT次数。

VUE-SSR[传送门](https://ssr.vuejs.org/zh/)👉

##### 6️⃣ 图片懒加载
模块中有大量的图片加载时，大量图片同时挂在到节点上，浏览器UI渲染线程就会特别忙...抽不出空来执行其他UI渲染(页面假死)，或者是其他Javascript计算(内容延迟)。   
使用图片的懒加载，有许多优秀的现成的工具，其原理是超出视窗(可以自定)范围的图片咱不挂在到`DOM`上，也就不会触发下载和渲染，等到用户滚动窗口，再根据视窗位置去挂载`IMG`标签，下载图片资源，渲染图片资源。


##### 7️⃣ 使用web worker处理耗时的计算操作   
浏览器的渲染是单线程，Javascript的大量计算会阻塞UI渲染，使用新建web worker新开启一个进程来进行耗时的计算操作，可以大大减少对UI渲染的阻塞。    

##### 减少CSS范围选择器的使用
当页面有大量DOM节点的时候，大量使用范围选择器，会引起CSS选择器查询事件累计加长。      

## 整体实施
❤️ 性能优化需要数据作为支持，而前端的性能数据的收集，依赖于我们在项目中的埋点。  
❤️ 建立数据分析平台，收集大量的监控数据，进行分析。  
❤️ 根据分析结构优化代码，然后再继续监测。  

## 参考文章
[1] [页面优化与安全 - by 掘金](https://juejin.im/book/5a8f9ddcf265da4e9f6fb959/section/5a8f9f7bf265da4e82635e46)     


# 前端性能优化_第一曲  
