![](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/blog_assets/css_opt_cover.png) 

 HTML是页面的骨架，而 CSS 作为页面的衣服，才是页面展示的重要环节。

 相信大家都见过，满屏`id`和满屏`行内样式`的祖传代码吧。眼花缭乱的代码..不可复用..不可修改的代码...我知道你想原地爆炸....
```html
<div id="containerWrapper" style="height:400px;width:auto;line-height:400px;">
   <div id="container"  style="background-color:red;border:1px solid green;">
   <!--  更多元素  -->
  </div>
</div>
```
当然`↑↑↑↑↑`那种代码是你一次又一次的贪图方便直接行内修改而引起的，`九层之台，始于累土`，CSS的`编码习惯`和`设计思维`是需要贯穿项目本身的

## 基础优化
现在`css`在日常的开发中，越来越多地被UI框架减轻压力...(其实造轮子和改样式的需求还是hin多的)，熟悉前端的开发者，一般懂得以下几点：

1. 使用`class`属性共享样式     :heavy_check_mark:

2. 使用项目公共样式表，项目全局使用，进一步减少`css`代码     :x:

3. 不使用`id`作为元素修饰选择器。特别是因为选择优先级的时候，不要因为追求一时爽，而放弃程序的可维护性。    :x:

4. 不要使用嵌套过于复杂的`css`选择器。   :x:

## 编码优化
编码上，我们知道css解析选择器的时候，`render-tree`的搜索方向是从叶子结点出发的，编码上也就是从右往左读取的，逐级进行过滤。
####   :x: 尽量不使用通配符和属性选择器      
因为通配符选择器和树形选择器匹配到的标签过多，比较耗时。总的来说，我们要在css匹配规则最后(最右)书写比较精确的规则，以便浏览器更快地命中规则。       
```css
/*  * 表示全选，相当于没说，范围太大 */
.bodyContainer * {
    height:30px;
}
/* class="container"范围太大 */
.demo[class="container"]{
    width:90px;
}
```
#### :x: 尽量减少使用性能消耗高的属性
如`box-shadow`/`border-radius`/`filter`/`透明度`/`:nth-child`等 CSS3 属性用起来十分爽，效果也好，但当我们要考虑性能时，如有可以接受的替代方案，则考虑性能为先。
#### :x: 减少重排与重绘
这是个老生常谈的问题了，我们在了解浏览器渲染原理的时候，用户的一些操作，样式的先后被覆盖，影响DOM也会影响CSS，都有可能引起`重绘`和`重排`。        

##### 重排
1. 改变font-size和font-family     

2. 改变元素的内外边距     

3. 通过JS改变CSS类 

4. 通过JS获取DOM元素的位置相关属性（如width/height/left等）

5. CSS伪类激活
  
6. 滚动滚动条或者改变窗口大小

##### 重绘
当元素的外观属性，如颜色和可见度等不涉及DOM宽高的属性，改变的时候，浏览器会对页面进行重绘。
有时候这些改变时不可避免的，那么我们只好针对站在用户的角度去测试一下加载的性能。    

##### 站在用户的角度去测试
使用`chrome`的`devtools`的`performance`选项中进行配置，尽量模拟用户的最差环境进行开发测试。
####  :x: 不建议使用 css 原生 @import 来引入css文件
样式表的加载有其先后性，但是使用`@import`来关联样式文件，会导致样式文件下载顺序的紊乱，甚至于后续js文件下载的顺序混杂在一起，导致不可预知的后果。
使用并行的`<link>`标签来引入多个样式表，可以让多个样式表并行下载。
> @import无论写在哪一行，都会在页面加载完再加载css,也就出现了，页面本来样式已经排布完(已经到了DOMContentLoad),然后又要去加载@import的内容，就增加了页面重新排布的可能。

详细参考这篇文章：[为啥不建议使用@import?](https://blog.csdn.net/qq_41813695/article/details/80489601)    

不知道啥是`DOMContentLoad`?看看这里:[浏览器优化3 之 页面加载的Timeline](/browser/PaintTiming.md)

#### :heavy_check_mark:使用`BEM`等编码规范
使用行为状态分离`class`命名规范，提高样式代码的可读性、修改灵活性。也是用于大型项目开发的多人合作编写`CSS`。

以上是编码上的优化，接下来再看看项目架构划分上的性能优化..

## 性能优化
### :heavy_check_mark: 首屏使用内联样式
在众多的用户体验中，首屏加载效果是经常被提起的。在样式的表现就在，当首屏代码量较大，需要的样式代码比较多，而大量的CSS代码存放在`<link href="../css/index.css">`的外链样式表中，这意味着需要多一次的`http`请求去获取样式文件，而且因为浏览器的<span style="font-weight:bolder;color:red;">阻塞渲染机制</span>，用户在外链样式表下载完成之前，不能看到他们所关心的首屏效果...

聪明的你明白，这时候我们就需要把首页(甚至只是首屏)的关键`CSS`代码，改为内联的形式。
这里我们会涉及到一个关键词语`Critical Css`如何判断哪些是`关键CSS`，哪些我们该作为内联样式呢？这篇文章结合了`webpack`+ `critical css`讲解了如何进行优化，[《webpack_关键css》](https://www.jianshu.com/p/66f3bbc26f29)，另有时间再做总结。
(preload属性)

##### 注意
* 因为tcp存在`初始拥塞窗口`的的机制，想要抢先下载首屏 css，则要保证内联了css代码的首屏html代码不能过大，经过长期的经验，这个值通常为`14.6kb`。否则，首屏的html问件可能需要被切分几次传输，则达不到优化的效果。     

* 内联部分的 CSS 是不会像外链 CSS 文件那样被浏览器缓存下来的。

###  :heavy_check_mark: 异步加载CSS
我们通常使用`<link rel="stylesheet" href="css/style.css">`去引入`css`，这样书写的引入，被浏览器认为是需要同步引入样式表。我们知道，这样的引入方式：   

1. css 的加载不会阻塞 html 的解析
2. css 的加载会阻塞 html的渲染
3. css 的加载会阻塞后面JS语句的执行

因此我们有必要进行`css`代码的异步加载，使得这些阻塞问题不存在。      

##### 1. JS动态创建插入
```js
let link1 = document.createElement('link');

link1.href = '/public/staticAssets/bdmap/css/baidu_map_v2.css';

link1.rel = 'stylesheet';

document.head.appendChild(link1);
```

##### 2. 降低外链文件的优先级
使用`media`属性，将该属性改为不识别的值，浏览器将降低该资源的下载优先度，当完成后将值设定回原值。
```html
<link rel="stylesheet" href="mystyles.css" media="noexist" onload="this.media='all'">
```
##### 3. 异步下载css
使用`preload`属性，告知浏览器异步地去加载这个资源。需要注意`preload`的兼容性，我们会使用[`loadCss`](https://github.com/filamentgroup/loadCSS/tree/v2.0.1#loadcss)进行`polyfill`
```html
<link rel="preload" href="mystyles.css" as="style" onload="this.rel='stylesheet'">
```

兼容性
![](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/blog_assets/preload.png)
###  :heavy_check_mark: 样式表压缩
这是我们最常用的方法，减小css样式表文件的大小，能够有效地减少文件传送时间。
`webpack`等构建工具
```js
{
  loader: 'css-loader',
  options: {
    minimize: true
  }
}
```

###  :heavy_check_mark: 删除多余的CSS
我们的项目中，通常会产生两种多余的CSS代码
1️⃣ 两段css代码都对一个元素的同一个状态进行了修饰，一个等级高一个等级低，则肯定有一方被覆盖，被覆盖方可能就是`无效css`。
2️⃣ 项目公共库中还没有`match`的`css`代码，我们也认为是无效的`css`代码。
当然我们还是推荐使用`webpack`+ `purifycss`，官方讲解[摸我](https://github.com/webpack-contrib/purifycss-webpack)，网友讲解[摸我](https://www.cnblogs.com/hezihao/p/8029590.html)       

最后，我们做一个预告，我们将在后面的文章《浏览器性能优化 5 - GPU加速》中继续讲解如何利用图层的合成规则进一步优化我们的渲染性能。[传送门👉](/CSS/GPU.md)     

## 参考文章
1. [preconnect, prefetch, preload, pre what? An intro to Resource Hints | JSUnconf 2018](https://www.youtube.com/watch?v=6q75MVFLlok)
2. [css 性能优化 - by 奇舞团](https://juejin.im/post/5b6133a351882519d346853f)
3. [你真的知道为什么不推荐使用@import?](https://blog.csdn.net/qq_41813695/article/details/80489601)     
4. [重绘与重排的操作](https://csstriggers.com/)    
5. [你真的了解重回和重排吗？](https://www.cnblogs.com/chenjg/p/10099886.html)      
6. [通过rel="preload"进行内容预加载 - MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Preloading_content)    


