# 防抖与节流

## 啥是防抖
防抖(Debouncing)与节流(throttle)都是用来控制有个函数在一定时间内，限制执行次数的技巧，两者相似而又不同。 之所以叫抖动，时间的频繁触发可能是和动物的抽搐相类似吧。
## 为何要防抖和节流？
窗口的`resize`、`scroll`输入框的`input`都属于高频事件，高频率触发这些时间，会对浏览器造成过于繁重的负担。
> 防抖与节流二者最大的区别是，前者用的是“冷却时间” 而后者用的是 “保护时间” 。

>冷却时间内，相同的事件触发，会导致冷却时间重新计算（也就是延迟）。
![防抖](../blog_assets/debounce.png)

>“保护时间”内，相同的事件触发，不会导致保护时间重新计算。
![节流](../blog_assets/debounce2.png)

## 防抖动的几种方法：
#### ① 延迟执行版
> 首次触发，立即执行，在一定时间内屏蔽后续相同的该事件。 
```js
// 整体使用一个闭包的形式
const debounce = (callback,waitTime,...args) =>{
    let timeout; // 定时器
    return function(){
       const context = this;
       // 判断当前是否处于一个事件保护时间段，若是，则取消掉当前的定时器对象
       if(timeout) clearTimeout(timeout); 
       // 为最新的操作的事件处理，设定一个定时器
       timeout = setTimeout(()=>{
           callback.apply(context,args);
       },waitTime)
    }
}
var zone = document.getElementById("zone");
 // 绑定事件
zone.onmousemove = debounce(function(){
    count ++;  
},1000)
```
#### ② 立即执行版
>  首次触发，合并后续动作，等待+静止（没有该事件再发生）一定时间后，统一将事件触发一次。
```js
const debounce = (callback,waitTime,...args)=>{
    let timeout;
    return function(){
        const context =this;
        // 事件触发不可能累加，若有事件在栈中，则清除当前的定时器
        if(timeout) clearTimeout(timeout);
        // 若当前还有定时器存在，则证明当前处于事件冷却阶段，反之则相反
        let callNow = !timeout;
        // 给定时器本身设定一个清除的时间，冷却时间后则
        timeout = setTimeout(()=>{
            timeout = null;
        },waitTime)
        // ① 如果当前不处于冷却时间，则可以立即执行下一次事件。
        // ② 若是第一次触发，timeout对象为undefined，则时间立即被执行。
        if(callNow){
            callback.appy(context,args)
        }
    }
}
```

## 节流
> 防抖和节流都在于将一定时间内相同的事件进行合并，合理减少事件的响应。

>防抖重点在于，在本次事件进行响应 或者 下次事件开始收集  之前，先必须经过一段时间的冷却时间。

> 而节流是在事件连续触发时，设定一定的定时器间隔，作为保护时间，保护时间内允许触发事件，且事件的触发不导致保护时间重新计算，保护时间结束后，进入新的一轮事件响应。

#### 立即响应版
```js
const throttle  = function(callback,waitTime,...args)=>{
    let pre = 0 ; // 初始值设置为0，保证第一次事件会立即执行。
    return function(){
        const context = this;
        let now = Date.now();
        if(now - pre >= waitTime){
            callback.apply(context,args);
            pre = Date.now();
        }
    }
}
```


## underscore中的解决方案
```js
/**
* underscore 防抖函数
* @param {function}  func  回调函数
* @param {number}  wait   表示时间窗口的间隔
* @param {boolean}  immediate 设置为true时，是否立即调用函数
* @return  {function}      返回调用的回调函数
*/
_.debounce  =function(func,wait,immediate){
    var timeout,        // 冷却时间 
          args,         // 参数几何
          context,      // 函数的执行上下文环境
          timestamp,    // 当前的时间戳
          result;       // 返回的结果
    var later = function(){
        // 本次触发的时间与上一次相比较
        var last = _.now() - timestamp;
        // 若果当前时间间隔少于设定时间，则重置定时器 ，继续延迟执行（冷却时间的特性）
        if(last < wait && last >=0){
            timeout = setTimeOut(later,wait-last);
        }else{
            // 清除定时器
            timeout = null;
            if(!immediate){
                result = func.apply(context,args){
                    if(!timeout) context =rgs =null;
                }
            }
        }
    }
    return function(){
        context = this;
        args = arguments; // 参数列表
        timestamp = _.now();
        var callNow = immediate && !timeout;
        // 如果定时器不存在就创建一个，若当前已存在定时器，则表明处于冷却时间，接下来的操作也不会执行
        // 若是初次进行操作，则不存在定时器，需要新设定定时器
        if(!timeout) timeout =  setTimeout(latter,wait);
        // 若果需要立即执行的话，则通过apply执行
        if(callNow){
            result = func.apply(context,args);
            context = args = null;
        }
        return result;
    }
}
```
参考文章:
 [【防抖与节流-Sofia】](https://juejin.im/post/5b7b88d46fb9a019e9767405)
[【节流与防抖 - 薄荷FE】](https://juejin.im/post/5b8de829f265da43623c4261)


