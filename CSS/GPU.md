# 页面渲染与硬件加速

> 首先我们明确一个概念，重绘和重排都是在一个`复合层`内的概念，一个复合层内的元素变化，不会影响到另一个复合层。GPU对于每一个复合层都是实行单独绘制的。      

1️⃣ 普通文档流内可以理解为一个`默认复合层`里面，不管添加多少元素都是在同一个复合层里面。    

2️⃣ 绝对定位布局，和固定定位布局都是可以脱离普通文档流的，但是在图层中，仍然从属于`默认复合层`。  

3️⃣ 我们声明一个新的复合图层，CPU会为其单独分配资源，当然也会脱离普通的文档流，这样新的(频繁变化的)复合层内容，就不会影响原来`默认复合层`的重绘和重排。    
在Chrome调试工具中，有这么一个工具，可以查看复合层的情况
![](/blog_assets/render_border.png)
可以查看到不同符复合层的分层情况。

![](/blog_assets/render_border.jpeg)
### 如何启用硬件加速  

1️⃣ 使用 `translate3d` `translateZ` 硬件加速。   

2️⃣ 使用`opacity`属性或者过渡动画。  

3️⃣ `will-change`属性。  

4️⃣ 使用`<video>` `<iframe>` `<canvas>` `<webgl>`  

5️⃣ 或者使用 `flash`插件  

#### 注意点
1️⃣ absolute只能够使内容脱离当前的文档流，但是不能够脱离当前的`复合层`,页面内若过多使用`absolute`的话会使得同一个复合层内的计算变变得特别的复杂。   

2️⃣ 在使用加速的时候，尽量指明z-index，否则在此元素后面的元素，若层级比当前的高。则也会成为一个新的复合层，引起复合层数目的不可控，最终也会极大影响性能。  



RenderObject(LayoutObject)  DOM树种每个Node节点都有一个对应的`LayoutObject`

RenderLayer(PaintLayer)     渲染层

Compositing Layers    合成层   

GraphicsLayers -> GraphicsContext 

每一个HTML element元素都有一个node与之对应     

DOM树到最后的渲染，需要进行一些转换映射     

一般来说，创建`Paint Layer`的原因有三种：  
1️⃣ NormanPaintLayer   
* 根元素   
* 有明确定位的元素  
* 透明度不为1的元素   
* 使用了滤镜（filter）属性的元素   
* 使用了 Mask 属性的元素   
* 使用了 mix-blend-mode 属性  
* 使用了 teansform 属性   
* backface-visibility 属性为hidden  
* 使用了 reflection 属性   
* 有 CSS column-count 属性，或者有 CSS column-width 属性   

2️⃣ OverflowClipLayer   
* overflow 不为 visible   

3️⃣ NoPaintLayer   
* 一个不需要绘制paint的元素。比如说一个空的div元素。       

若没有出现这三种情况，则这个LayoutObject则和第一个拥有渲染层的父元素，共用一个渲染层。    

![](/blog_assets/devtools_fps.png)
##### 渲染层提升为合成层   
1️⃣ 直接原因   

2️⃣ 后代元素原因  

3️⃣ overlap 重叠原因 


##### 层压缩  


##### 课程笔记
render:也就是把模型（元素和css信息）变成位图的过程，称之为渲染。

一个元素可能对应着多个盒子，每一盒子对应着一张位图

图形类 ： 边框，SVG,阴影，都属于图形类

渲染过程是不会将子元素绘制到位图上去的。这样能够最大程度缓存渲染的结果，减少重新渲染的机会。     

阴影会作为一个独立的盒子来处理      

合成(composite)：不是必要的一环，最大限度减少绘制次数的原则。   
使用猜测的策略。
使用will-change进行提示。

脏矩形算法   

渲染把元素变成了位图，合成操作把一部分位图变成合成层，最终的绘制过程把合成层显示到屏幕上。
___
### 参考文章
[css3硬件加速](https://div.io/topic/1348)     
[chrome渲染优化](https://www.oschina.net/translate/chrome-accelerated-rendering?cmp&p=1)   
[will-change](https://www.cnblogs.com/yuzhongwusan/p/4186405.html)      