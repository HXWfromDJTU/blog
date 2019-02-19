# history

html5中出现了一个专门用于管理历史状态的接口`history`,首先我们来看看兼容性。

![](/blog_assets/history_compatibility.png)

⭕️ IE 6-9不支持,移动端由于机型发展和淘汰，基本没有大问题。
鉴于这个api常常会在移动项目中用到，所以给一个机型对比的列表,[传送门👉](/browser/browser_version.md)           

### 属性
##### history.length   
表示包括当前页面在内的理事会话中的记录数量，浏览器的空白页(初始空白页)不算在内。   

##### history.scrollRestoration   
允许web应用再回话历史导航时，显式地设置，其值为`auto`或者`manual`。   

##### history.state  
首先这是一个只读属性，不可以通过直接的赋值操作`set`进行复写，表示的是会话历史堆栈中，定不记录的任意可序列化类型数据值。      
___
### 方法  
##### hsitory.go() 
加载历史会话中的某一个页面，通过该页面与当前页面的相对位置来决定，传递的是一个数字。0或者`undefined`表示当前页面，1表示向前一个页面，-1表示后退一个页面。若其他超出前后数目范围的数字，则方法不会进行反应。          

##### history.back()   
相当于 history.go(-1) 或者 用户手动点击了后退`button`     

##### hsitory.forward()
相当于 history.go(1) 或者 用户手动点击了前进`button`  

##### history.pushState
在历史会话记录堆中，从顶部插入一条记录，参数包括
```js
（
    obj:xxx //表示可许丽华的object对象数据   （可选）
    title:'首页 - 康师傅' // 页面title (可选)
    url:'xxxx' // 页面url   (必须)
）
```
___

##### hsitory.replaceState
接受一个与`pushState`一样的参数，替换掉当前绘画记录栈顶的会话对象。       

### 如何实现页面跳转但是不记录浏览及历史呢？  
以前的web项目，一个功能/模块都是以一个page为单位的，我们想要从A模块到B模块，一般使用的就是超链接跳转。但是在SPA盛行的今天，使用`hash tag`切换功能模块、跳转模块的场景比比皆是。     
造成了分类操作和模块切换都混合成了`hashchange`事件，而且都会被浏览器记录历史。      

我们回退浏览器的时候，肯定是想回到上一个模块

`location.replace()`


`history.replaceState()`     
```js
$("#header nav a").on('click',function(e){
    e.preventDefault(); // 清除默认跳转行为
    history.replaceState(null,document.title,this.href.split('#')[0]+'#');
    location.replace('');
})
```   

1️⃣ `go()` `forwoard()` `back()`    