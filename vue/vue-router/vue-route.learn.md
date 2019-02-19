# Vue-router 读源码 <span style="font-size:18px;">-- 深入探究前端路由实现</span>

现代前端工程，spa逐渐占领多数市场，模块间的跳转都是“非跳转非刷新”实现的。   

实现更新视图，但不刷新页面，可以有两种方式实现
* 利用URL中的hash
* 使用H5 中的History 接口新增方法

### 尝试实现一个简单的前端路由吧 

```js
class SwRouter{
     constructor(routes){
         this.currentUrl = ''; // 表示当前的url
         this.routes = routes; // 初始化整理路由表 {path:xxxx,page:xxx}
         this.history = []; // 维护各个历史页面的状态   
         this._binding();
     }
     // 绑定事件
     _binding(){
        window.addEventListener('load',this.refresh,false);
        window.addEventListener('hashchange',this.refresh,false)
     }
     // 寻址：跳转到某个路由地址对应的页面
     route(path,callback){
         this.routes[path].callback = callback || function(){};
     }
     // 
     refresh(){
         this.currentUrl = location.hash.slice(1) || '/';
         this.routes[this.currentUrl]();
     }
     // backOff(){
         this.currentIndex
     }
     goback(){
         
     }
}

```

在 `vue-router` 中是通过mode这一个参数来实现，选择使用哪一种实现方式
```js
const router =new VueRouter({
    mode:'history',
    route:[...]   //用户配置的路由表
})
```   


* 可以为hash的改变添加监听事件：
>window.addEventListener("hashchange", funcRef, false)



