# requestAnimationFrame - 熟悉的陌生人
这家伙可真是个熟悉的陌生人啊，为啥？每次写node端程序的时候，提词器每次都调皮地把`requet`第一推荐为`requestAnimationFrame`,这个单词还长，每次都要回退半天。🤣 
![](/blog_assets/raf_mistake.png)  

这回定下心来好好认识认识这个熟悉的陌生人吧......看名字估计是用来画动画的吧

### 准备知识
浏览器重绘频率一般回合显示器的刷新频率保持一致，显示器🖥 常见的刷新频率为(60HZ或者75HZ)，也就是说每秒最多会重新绘制60到75次。

我们可以根据以上的内容，计算60HZ下，每`1000ms/60=16.66ms`刷新一次屏幕就可以，那么我们的动画也不需要小于这个时间间隔。要是特殊一点，是75HZ下的情况，也是`1000ms/75=13.3ms`刷新一次就可以了。    

> 所以说，我们使用`定时器`制作动画，时间间隔就没有必要低于这个`屏幕刷新的最小时间`。

而相邻的两次`RAF`的时间间隔，会自动调用浏览器接口从而获取屏幕的刷新频率，计算出合适的时间间隔。而不用像使用`定时器`那样需要调用者手动估算动画时间。        

#### 和setInterval的区别   

setTimeout是基于时间的周期性操作，只要物理时间在流动，那么间隔操作就不会进行。  

而requestAnimationFrame是基于帧的，只要浏览器的帧刷新停止了，那么RAF的回调函数就不会再执行。       

就像是用户最小化浏览器窗口(或者切换了mac中的多桌面)，浏览器自然就没有必要跟着屏幕而进行刷新帧。而此时`requestAnimationFrame`的执行就会无效。因为`RAF`基于的是帧刷新，而最小化就相当于`setInterval`中的时间停止流动了，则`RAF`的执行就也无效了。     

比如在制作一个视屏弹幕效果的时候，使用`setTimeout`和`RAF`都可以实现字幕的滚动效果，咋看是没有问题的。     

但当用户把浏览器放置到后台的时候，定时器仍然在执行，弹幕仍然在滚动，会造成额外的性能浪费。而使用`RAF`制作的动画，当用户将浏览器放置到背景之后，
![](/blog_assets/background_RAF.png)  

最小化后等待一段时间，再次打开。发现字幕会被重置，而不是持续滚动。

![](/blog_assets/background_RAF2.png)

再来看另外一个例子,代码如下，动画效果是一个蓝色小块沿着东南方向周期移动。
```js
var elem = document.getElementById('anim')
var startTime;

function render(time) {
  time = Date.now()
  if (!startTime) {
    startTime = time
  }
  elem.style.left = ((time - startTime) / 10) % 500 + 'px'
  elem.style.top = ((time - startTime) / 10) % 500 + 'px'
}

elem.onclick = function() {
  (function animloop() {
    render()
    requestAnimFrame(animloop, elem)
  })()
}
```  

动画执行一段时间后，最小化浏览器，然后再打开，发现元素位置不变。
![](/blog_assets/block_RAF.png)

![](/BLOG_ASSETS/block_RAF2.png) 


### RAF的使用
其实RAF在使用上像是一个`setTimeout`而不是`setInterval`，因为调用一次RAF，只会执行一次，需要在回调中再次去设置RAF才能够实现。但是熟悉JS异步任务的都知道，异步队列的执行需要等待主函数执行完毕，也就是说前面的任务会造成定时器`不准时`，要是在动画中，则会出现`卡帧`。     
![](/blog_assets/setTimeout_delay.png)   


##### Q:RAF也是JS的函数，为什么不会被延迟呢？   
答案是也会被延迟

##### 函数节流
得益于这个优点，RAF也可以用于用于函数节流。  


### 兼容性
说了这么多，我们最后看一下兼容性   
![](/blog_assets/RAF_campatibility.png)    

```js

```  

___
### 总结 
`RAF`采用的是浏览器帧刷新间隔，始终保持最佳绘制效率。不会因为动画间隔过短，过度消耗性能。也不会因为事时间过长，使得动画卡顿。 

