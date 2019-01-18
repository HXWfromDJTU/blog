# 浏览器渲染简析
![](/blog_assets/browser_work_cover.png)
>了解目的：为了项目的更好优化，为了提高浏览器的解析速率，减少页面无用的重绘，重置

### 一个请求的生命周期：

1️⃣ 用户输入网址(URL),浏览器查找DNS服务器，寻找对应的ip地址  
(DNS查询过程博文，[传送门](/network/DNS.md)👉) 

2️⃣ 浏览器根据ip地址，向服务器发送获取资源的请求  

3️⃣ 服务器端返回一个HTML响应

4️⃣ 浏览器收到返回的内容，浏览器开始解析HTML内容  

### 浏览器的解析
1️⃣ 将下载来的`HTML字符串`转化成浏览器能够识别的`DOM Tree`  
![](/blog_assets/DOM_TREE.png)
2️⃣ 根据 `CSS内容`内容生成`CSSOM Tree` （或者称之CSS Rule）
3️⃣ `CSSOM Tree` 与 `DOM Tree`合起来生成 `Render Tree`准备对页面进行排布和绘制。    
4️⃣ 先进行页面的布局(排布)  (layout)
5️⃣ 布局完之后就会开始进行着色渲染，我们称之为“绘制” (paint)  
6️⃣ 复合图层化（Composite）
基于第三点的RenderTree，我们又延伸出了`Render Layer`的概念，一个`Render Layer`上有N个`Render Object`。 

![](/blog_assets/tilt.png) 
<div style="color:grey;text-align:center;margin-bottom:20px;">chrome的 『Show composited layer borders』模式</div>

最后，浏览器调用`GPU`进行渲染。    
想了解更多内容的，请去访问我的另一篇博文[《Render Layer与GUP加速》](/css/GPU.md)👉
 
<!-- 4️⃣ 渲染过程中若遇到`<script>`标签下载完成，则会马上开始执行，优先级高于`render`，而我们知道浏览器的渲染线程和JS解析线程是互斥的，所以这里js的执行就会停止UI的渲染。  
(想了解更多，请看另一篇博文[传送门](/browser/JS_browser_thread.md)👉）   -->

👺👺 所以我们通常会把script标签插入到DOM的底部  
👍 因为js中可能有DOM操作，而此时DOM的加载可能没有完成，操作就会失败。
👍 JS中若有DOM操作,改变页面的样式，那么DOM就有可能多次变动，造成页面不稳定。  


#### 其他情况说明
🚸 浏览器`解析CSS`过程不阻塞；

🚸 浏览器在代码中发现一个`＜img＞`标签引用了一张图片，向服务器发出请求。此时浏览器不会等到图片下载完，而是继续`渲染`后面的代码。
服务器返回图片文件，由于图片占用了一定`面积`(宽度高度)，影响了后面段落的`排布`，因此浏览器需要回过头来重新渲染这部分代码；  

![rendingprocess](/blog_assets/redning_process.png)  
![rendingtree](/blog_assets/rendingtree.png)   

#### 重绘与重排
1️⃣ `Reflow`   
浏览器发现某个部分的变化，影响了布局，就需要重新回去渲染。   

2️⃣ `Repaint`   
浏览器发现，某些变化只是改变了背景颜色，文字颜色，不影响元素周围或者内容的属性，浏览器将只会进行repaint。

3️⃣ `Reflow` 相比 `Repaint`更加浪费时间，也就更加影响性能。需要尽量避免。

#### 加载原则
1️⃣ 外链`css`的异步加载不会阻塞`HTML`的解析，但会阻塞页面的渲染<span class="tips">因为要等合成Render Tree</span>

2️⃣ 外链的`script`标签会阻塞`HTML`的加载，加载完后也会立即执行。内嵌的`script`标签的JS代码也会遇到就立即执行

🚸 执行的`script`内容中，有队DOM进行的操作，其中的操作有可能引起浏览器的`重绘`或者`重新渲染`。

🚸 用户若有异步的JS操作，也同样会引起浏览器的`重绘`或者`重新渲染`。(例如用户点击按钮，某个部分隐藏) 

🚸 无论外链，还是内嵌。JS代码中的运行若出错，HTML会停止解析。（包括页面的渲染、其它资源的下载）  

#### 简单优化建议
☎️ 将所有`script`内容放置到`body`标签的末尾去，最大程度避免页面加载的阻塞，也避免操作到未加载的DOM内容  
☎️ 尽可能地减少script外链的数目，减少网络请求次数(对此，可以使用`gulp`和`webpack`等打包工具整合JS实现)   
☎️ 使用现代浏览器的异步非阻塞加载   
  ♐️ defer属性
  ♐️ 使用JS代码动态插入`script`外链标签

更多浏览器优化建议，请移步我另一些笔记📒... 
[css性能优化](/CSS/css_optimize.md)    
[浏览器渲染优化](/browser/rending_optimize.md)  

___
### 参考文章
[从URL输入到到加载完成的过程 - FEX baidu](http://fex.baidu.com/blog/2014/05/what-happen/) 

封面图来自[赵九杰 - 艺术家主页](http://www.artwe.com/Artist?artist_id=831)  

[浏览器工作原理](https://github.com/slashhuang/translation/blob/master/%E6%B5%8F%E8%A7%88%E5%99%A8%E6%B8%B2%E6%9F%93%E6%9C%BA%E5%88%B6)

[css3硬件加速](https://div.io/topic/1348)   


<style>.tips{color:red;font-size:12px;border:1px solid grey;border-radius:5px;background-color:#aaa;position:relative;top:-15px;}</style>
