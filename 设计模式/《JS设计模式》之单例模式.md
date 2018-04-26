# 单例模式
### 定义
>保证一个类仅有一个实例，并且提供一个访问它的全局访问

### 常用位置
往往都只需要一个的对象，比如：`线程池`，`全局缓存`，`浏览器的线程池`
前端的应用点：`系统的登录窗口`

### 设计原则
1、通过一个标志量，来标志当前是否已经为那个类创建过对象了，若果是，则在下一次获取该累的实例时，直接返回之前创建的对象。
检验规则
```javascript
//无论多少次创建的实例，必须指向同一个对象，保证在应用中不会出现两个不同的实例
var a = new Singleton("Leborn");
var b = new Singleton("Kobe");
console.log(a === b );   // true   
```
2、创建单例对象、判断是否已存在该单例对象，这两个工作必须遵守`类的单一职责概念`，所以需要分离设计出`创建类`、`代理判断类`

3、需要符合`惰性`这一个特性，用户不进行主动操作，则不主动触发
常见案例：使用惰性单例，创建用户登录框
```javascript
//使用闭包进行创建生成器
var createLoginLayer = (function(){
    var div;
    return function(){
        if(!div){
            //创建一个登录框
            div=document.createElement("div");
        }
        return div;
    }
})()
//用户点击时候进行，调用创建器创建登录modal框
document.getElementById('loginBtn').onclick=function(){
    var loginLayer = createLoginLayer();
    loginLayer.style.display = "block";
}
```
4、抽象化的惰性单例
```javascript
//此处的 fn 是用于创建惰性单例对象的方法
var getSingle = function(fn){
    var result;
    return function(){
        return result || (result = fn.apply(this,arguments));
    }
}
```
fn可以使多种多样的
```js
// fn 只负责创建部分的代码的声明，对象的创建交给惰性单例管理器
 var createLoginLayer = function(){
     var div =document.createElement('div');
     div.innerHTML = "我是一个登陆窗口"
     document.body.appendChild(div)
     return div;
 }
```
使用的时候
```js
// 通过惰性单例管理器，创建单例对象
var createSingleLoginLayer = getSingle(createLoginLayer)
```
总结
> 创建对象的函数 和管理单例的职责被分布在两个不同的方法中，这两个方法组合起来，才具有更大的灵活性。

