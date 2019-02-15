## 浏览器渲染中的Timeline  

我们知道在浏览器渲染中，页面渲染有几个关键的时刻比如说`First Paint`、`DOMContentLoaded`、`Onload`以及`可交互时间`。     

打开我们亲爱的淘宝页面，使用`devtools`中的`Performance`面板录制一段从初始加载到完成的过程，可以看出各个资源的下载和执行的过程，也能看到`Chrome`给我们标出了所需要注意的几个关键时间点。     
![](/blog_assets/paint_timing_taobao.png)     


### DOMContentLoaded   
直接看字面意思，就是DOM的内容加载(解析)完毕了。而据我们之前所知，页面中脚本(无论是外链还是内联)的执行都会阻碍DOM的解析，也就是说脚本的执行，会延迟`DOMContentLoaded`事件的到来。

![](/blog_assets/script_block_parse.png)   

如上图所示,DOM的解析阻塞于脚本的加载，而脚本的加载也受限于脚本前面的css加载完成后才会执行，在任何情况下，DOMContentLoaded的触发不需要等待图片或者其他任何资源的加载完成。     
![](/blog_assets/rendering_process.png)   

这里插一个题外话，`async`标明的脚本不知道何时会加载完，而后立即执行，所以`DOMContentLoaded`事件也不会等它。但`type=module`和`defer`标明的`<script>`标签脚本一定会先于`DOMContentLoaded`事件。        

以下代码都是我们熟悉的用于监听`DCL`事件  
```js
// jQuery
$(document).ready(function(){......}); // 或者
$(function(){...});
// 原生
document.addEventListener('DOMContentLoaded',function(){......})
```
     
##### Q：我们把script沉到body后面可以让DOMContentLoaded提前吗？  
首先回答是不可以的。     
因为`DCL`的定义是整个文档都加载完成，当然也包括body外，HTML内的script标签。    
但是我们要是把`script`标签放到了`header`中，往细说是阻塞了`body`的解析，那么body中有啥？当然就是我们页面的主要内容结构啦。      

理论上浏览器会等待DOM和CSSOM都解析完生成RenderTree才开始布局和绘制，但是现代的浏览器，为了减少白屏等待事件，都会进行HTML局部的渲染。     

![](/blog_assets/FirstPaint.png)

上面的截图同样来自于淘宝首页，我们可以看到在DOMContentLoaded之前，就已经触发了`FirstPaint`,页面空白的时间的不到`20ms`。但是DOM远远没有解析完，只是部分完成了。这个过程中，我们发现并没有表示`script`执行的黄色片段。 

下面我们来看看`www.hoopchina.com`虎扑网的首页（暴露了JRs的身份哈哈，id:597371030欢迎互粉）   

![](/blog_assets/FCP_Example.png)   

所以我们将script标签写在header中则会阻塞body的解析，也就是会阻碍`First Paint`的到来，也就是说用户看到的白屏时间会更长。      

所以呢，js代码沉底，只是减少First的时间，而不是减少`DOMContentLoaded`的时间。     
##### 兼容性(ie滚粗)   
![](/blog_assets/DCL_Compatility.png)   

看到图中红色的块块了吗？...在ie 6-8下,请做以下兼容
```js
 document.onreadystatechange=function(){
   /*dom加载完成的时候*/
   if(document.readyState=='complete'){
       fn&&fn();//处理事情
     }
   };
```
既然上面提到了FirstPaint那么我么就先说说FirstPaint相关的知识。      


### FirstPaint   
s首先呢，Chrome 的devtools给我们细微的划分了FirstPaint为`First Contentful Paint`(首次有内容的渲染)和`First Meaningful Paint`(首次有效的渲染)。    

##### FirstPaint && FirstContentfulPaint
使用 `window.performace.getEntriesByType` 这个api可以检测到这两个阶段的开始时间。     

![](/blog_assets/performance.getEntriesByType.png) 

FirstPaint 表示的是页面上第一个`像素`被绘制上去的时刻，有可能是背景颜色。

FirstContentfulPaint 表示的是浏览器第一个DOM节点渲染到品目上的时间。  

从上面的测试结果也可以看出来，二者之间的间距非常非常之小，但这两者共同决定了我们常说的白屏时间。       

##### FisrtMeaningfulPaint 
FMP在chrome下的定义是，浏览器计算页面的内容高度或者说是内容多少变化最大的一个时刻，和我们通常意义上将的`首屏内容`(不包括滚动下滑的内容)意义相近。内容有没有意义，也只是我们网站开发者才能够知道的,所以我们能够根据这一条规则进行优化。        

还是来看看淘宝首页的情况吧，FCP的时候出现了顶部的搜索框，FMP的时候基本完成了骨架屏的渲染。
![](/blog_assets/FCP_FMP_DIFF.png)

### 可交互时间      
我们知道浏览器中的Javascript是单线程的，浏览器的渲染机制也规定了，UI渲染、JS执行和用户操作一个时刻只能够执行一种，一定会有一个先后顺序。(宏任务微任务的概念看这里，[传送门👉](/JS/eventloop.md))   

既然用户的操作会被JS的执行和UI渲染所阻塞，既然也不能完全避免这样的情况，我们就需要将这样的占用时间尽量缩短，或者说是`切割`。也就是说将长的JS代码执行任务，切割成小的执行任务。     

从人的感受上来说，用户给出的操作最好在`100ms`内要得到操作反馈，否则就会让用户感觉到`卡顿`或者说`不爽`。   

##### Time to interactive 
其实就是“可交互时间”的英文翻译，我们常简称为`TTI`。定义上来说，指的是用户看到了页面的大部分内容(近似于`FMP`)之后，准备进行用户操作，但是此时的主线程又被JS的执行所占用着，想输入，想点击但是都得不到浏览器的响应。       

借用一张图来表示,图不是我自己画的....来源[在这](https://yq.aliyun.com/articles/598162)
![](/blog_assets/TTI_process.png)


### Onload Evnet  

在文章首部的图中，我们发现`DOMContentLoaded`之后还有一个`Onload Event`，它表明的是页面上所有的资源(图片、音频、视屏)都被加载完的时刻，就会触发onload事件，并且它是固定会晚于`DCL`时刻的。因为onload是指DOM中的所有资源，而影响`DCL`只有CSS和JS这两种资源的加载与执行。        

<!-- 准确的来说所有的DOM节点都有`onload`事件，所以出于顶层的`Document`也有。     -->
![](/blog_assets/onload_small.png)   

![](/blog_assets/onload_pending.png)  

重要的是，也能确保使用`async`标记的`script`被加载并且执行完，假如我们的一些业务代码是依赖于这些异步加载的第三方库的，则不会出现业务代码操作失败。   

但因为`图片、视屏`这一类的资源一般都是加载时间较长，所以`onload`事件的使用，需要谨慎，否则会大大拖延业务代码的执行。   

对应到代码上，就是使用JS去监听`window.onload`事件
```js
window.onload=function(){
  document.getElementById("bg").style.backgroundColor="#F90"; //DOM操作
  // 或者其他任意业务代码
}
```




### 用户的感受  
总结一下，其实前端性能优化，就是服务于用户的感受的，说白了就是用户要感觉到`爽`，那么我们能不能够从交互的角度来量化一下用户的感受呢？   

以下是几个当你打开一个页面后，脑子里会闪过的几个念头...    

| 闪过的念头| 白话描述 | 内部因素 |
| ------ | ------ | ------ |
| 咦？访问成功了吗？ | 用户看到了页面切换，看到了白屏？不知道服务器是否有响应？  | FirstPaint、FirstContentfulPaint |
| 内容加载完了吗？ | 用户陆续看到了内容，但不知道页面内容加载完了没有？  | FirstMeaningfulPaint |
| 我可以动鼠标点击了吗？ | 页面看起来时加载完了，但是用户不知道自己可以操作了吗？  |  Time To Interact|
| 爽不爽？ | 整个流程下来，页面是否闪烁，内容上下乱跳，让用户有一个直观的感受，爽与不爽？  | 是否有长任务占用主线程，onload之后是否又频繁造成重排 |   

#### 如何优化   
##### 1️⃣  如何提前FP和FCP 
回看Timeline,阻塞FP和FCP的就是head标签中的css和Javascript,但是有些css确实首屏需要的(key-css的概念，看[这里👉](/CSS/css_optimize.md))则仍需要保留在head中避免频繁重排，Javascript脚本则可以放心地沉到body底部或者`defer`、`async`。   

使用http缓存本地资源，减少请求时间也是很重要的一点。   

##### 2️⃣ 如何提前FMP  
FMP是关键内容的出现，或者是大部分内容出现的时间。在这一点上客户端的渲染能力，远远比不上服务端的渲染能力，所以首推`SSR`。       

##### 3️⃣ 如何提前TTI  
TTI强调的点是交互，那么我们要消除或者减少的是页面`UI渲染`和`JS脚本执行`。   
* 保证首屏的组件先加载，非首屏内容/组件懒加载   
* 图片的懒加载，当遇到图片展示型的网页，大量的图片会严重地阻碍TTI。   
* 准备性的Javascript库尽量在`DCL`之前去加载执行，而不是让用户看到了页面再去等待加载时间，因为用户看到白屏至少不会想要去操作，或者说用户看到了所有内容就会立刻想去操作，若得不到反馈，会极为的不爽。   
> TTL最后的这一条优化，可以根据网站功能类型的不同去做不同优化，不要墨守成规。   

##### 4️⃣ 如何减少TTI后，对用户操作的干扰      
在非首屏情况下，大体不会有渲染的问题，但是用户的行为会触发javascript的执行，比如说复杂的JS计算也是会导致用户操作的卡顿，页面进入假死状态。     
* 使用`web-worker`进行多线程计算，然后返回结果到主线程。       
* 还是尽量减少图片的大量渲染   
* 在onload事件中，尽量少或者不要去大量规模操作DOM元素出现或则隐藏，从而大量影响页面的排布。是不是想起来，你在页面上想点击一个东西，却因为页面不断在上下跳动，总是点不中呢？       
* 使用骨架屏，稳定首页或者全页的骨架，减少后续资源加载对页面高度宽度的影响。 

___
### 参考文章
[前端性能量化标准 -by 云栖社区](https://yq.aliyun.com/articles/598162)

