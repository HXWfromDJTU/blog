# 设计模式汇总
![](/blog_assets/desgin_mode_cover.png)
> 本文系《Javascript设计模式与开发实践》的读书笔记整理，添加了一些自己的理解
### 单例模式
某一个对象在整个模块功能中只会出现一次，就像我们日常使用的全局变量一样
##### 设计重点
1️⃣ 写好通用的单例对象工厂函数。

##### 实战场景
登录页面中的登录窗口，一个某种东西（策略）的生成器

关键词： `全局唯一` `避免浪费` `重复使用`
##### 单例登录窗口
```js
// 获取单例
let getSingle  = function(fn){
    var result;
    return {
        // 借用方法实现创建登录窗口
        return result || (result = fn.apply(this,arguments)) 
    }
}
// 创建单例登录窗口
let createLoginLayer = function(){
    let div = document.createElemnt('div');
    div.innerHTML = '登录窗口';
    document.body.appendChild(div);
    return div;
}
// 创建登录单例
loginLayer = getSingle(createLoginLayer);
// 注意单一职责原则：1️⃣ 获取单例 2️⃣ 创建窗口 需要分离开来
```
___
### 策略模式
实现一个功能的方法有多种，我们可以把这些方法都封装起来，根据实际情况灵活地进行调用。

##### 最佳实践
可以封装一个通用的策略管理器，策略和对应的口令可以动态传入，然后再根据口令去调用。

##### 实战场景
表单校验器的封装，封装不同对不同类型字段的校验

关键词：`消除if-else` `策略与环境的分离` `策略可复用`
___
### 代理模式
在请求者与接收者之间架设一个代理者。有保护代理，也有虚拟代理。 
##### 设计重点
1️⃣ 维护一个中介对象，对外界的接口与原目标对象一直    

2️⃣ 中介经过处理后，代为操作目标对象
##### 实战场景
代理实现缓存、惰性加载中的代理(代理负责应对应访问，收集请求，待依赖下载完后再交付执行)、远程代理，保护代理（没有权限的时候，不允许访问）、写时复制代理(进行不可逆)

关键词：`代理与本体对外接口一致` 
##### 代理缓存
```js
// 通用计算缓存器
let createProxyFactory = function(){
    let cache = {}; // 缓存器
    return function(){
        let args = Array.prototype.join,call(arguements,','); // 使用当前请求的参数作为key，也就是只要参数一样，就会取出一样的结果
        if(args in cache){
            return cache[args]; //取出缓存结果
        }
        return cache[args] = fn.apply(this,arguments); // 根据 参数组成的key set值到缓存器中去。
    }
}
```
##### 图片下载代理
```js
// 显示图片的容器
let myImage =  (function(src){
    let imgNode = document.createElement('img');
    document.body.appendChild(imgNode);
    return{
        setSrc:function(src){
            imgNode.src = src;
        }
    }
})();
// 中介者：负责加载图片
let proxyImage = (function(){
    let img = new Image();
    img.onload = function(){
        myImage.setSrc(this.src); // 下载完成，将图片地址传给容器
    }
    return {
        setSrc:function(src){
          myImage.setSrc('/loading.gif'); // 下载期间先将容器呈现加载图片
          img.src = src; // 代理下载
        }
    }
})
// 使用代理设置图片
proxyImage('https://www.163.com/target.jpg');
// 注意单一职责原则： 1️⃣ 实际添加Image标签的功能 2️⃣ 预加载的功能  注意分离
```
___
### 迭代器模式
描述：一些有先后顺序的策略，按照先后添加到遍历器中，执行遍历器的时候，相当于依次输出策略的执行。
实战场景：实现一个兼容多种浏览器的上传插件

关键词：`外部迭代器与内部迭代器` `强顺序相关的策略模式` `自动执行，不需要设置key` `每一种策略对外的接口一致便于执行`

##### 通用迭代器
```js
// 遍执行器
let commonIterator = function(){
    for(let i=0,fn;fn = arguments[i];i++){
        let excute = fn();
        if(excute){
            return excute;
        }
    }
}
// 开动遍历器
let plan = commonIterator(plan1,plan2,plan3); // 依次传入不同的策略
```
___
### 发布订阅模式
又叫做观察者模式，定义一种一对多的关系，当一个对象的状态发生变化的时候，所有依赖于它的对象都得到通知。
##### 最佳实践
事件订阅模式是经典的订阅发布模式。在实现过程中，双方完全不需要知道对方的内部结构，仅仅通过“中转”交互。

##### 设计重点
1️⃣ 维护一个依赖收集的队列，保存需啊通知的对象
2️⃣ 维护一个添加依赖的方法  
3️⃣ 维护一个触发事件的方法  

##### 实战场景
1️⃣ Vue数据的双向绑定，在getter和setter中进行埋点触发。 
2️⃣ 购物车与订单  
3️⃣ 当一个模块的数据发生变化，需要更新到多个模块的时候(eventBus)
> 博主在实际项目中的应用。
需求：当前列表的实时刷新，有新的消息实时更新列表。而当用户按下了暂停刷新之后，有新的消息列表不再直接刷新，转而使用右上角弹出消息框的形式，消息框中显示累计未显示的数目。用户主动点击消息框，列表自动刷新。
##### 前提
☯️ 列表、暂停按钮、小窗都已封装为Vue单独组件 
##### 旧方案
♍️ 页面组件中的ajax请求为主体，在promise-then中，判断各种环境情况，然后使用大量条件分支语句实现。
##### 改进方案
♈️ 在有新数据出现的时候，在promise-then中直接通过`Vue`的`eventBus`去`emit`一个事件  
♈️ 各组件提前监听这个事件，当事件触发的时候，各自根据各自的情况触发自身的变化  
♈️ 从而消除了在Promise-then回调中的大量的条件分支语句  

##### 关键词
`避免轮询` `订阅者发布者分离` `事件中转站` `中转站作为接口` `先发布后订阅`

___
### 命令模式
主张把一个操作封装为一个命令类(或者闭包)，实现执行效果的回撤，命令的延迟执行。
##### 设计重点
1️⃣ 所有的命令都封装为一致的对象    
2️⃣ 维护一个堆栈来管理所有接收到的命令  
3️⃣ 命令的执行可以延迟、可以回退
##### 实战场景
1️⃣ 连续动画的操作 
2️⃣ 下棋游戏的一个个步骤 
3️⃣ FRS地图模式的各种异步操作  
> 此处博主在项目中需求应用到了命令模式。
需求描述：一般的地图加载与Marker绘制，由于地图依赖包是异步加载的，但是添加marker和绘制Polyline却是实时的。出现了调用绘图时，地图包未加载完成的问题。
###### 解决方案
♎️ 在页面请求和地图底层之间，架设了一个代理层，封装了drawLine 和 drawMarker 操作，每次操作前都会检查地图包是否加载成功。  
♎️ 在代理层维护了一个属性表示地图包是否加载完毕，维护了一个缓存操作队列用于保存调用者的操作命令。  
♎️ 若在未加载资源完整的情况下，调用绘制操作，代理层都会先将操作命令连同参数一起入队。  
♎️ 在地图资源加载成功之后，的callback中，代理层主动调用在缓存队列中的函数。 
♎️ 总结：使用中介和命令模式，完美递将操作封装在了内部，而不是暴露一个地图加载成功的事件，然外界去监听，从而复杂化了外部代码。  

关键词: `宏命令` `行为延迟` `行为回撤`
___
### 组合模式
描述：命令的组合，类似于宏命令嵌套子命令，层层嵌套，形成一个类似于树状结构的组合关系。关键点还是在，所有命令(宏命令与子命令)对外的接口都要一样。  
##### 最佳实践
1️⃣ 组合模式不是父子关系，是一个HAS-A关系，而不是IS-A关系。  
2️⃣ 若一个对象，在超过一个分支下都出现了，则不适合使用组合模式。  
##### 实战场景
1️⃣ 文件夹管理关系  
2️⃣ 组织关系树管理  

关键词 :`部分-整体层次结构` `各层级同等对待`

___
### 模板方法模式
大白话说就是Java的接口模式，接口类中生名了一些列的方法，子类必须去实现，然后也有一些final的方法去负责流程的调度。

##### 最佳实践
1️⃣ 使用Java的接口类 
2️⃣ 好莱坞原则

##### 设计重点
 1️⃣ 维护一个工厂，接受一个参数，通过参数实现多态，返回一个构造器
 2️⃣ 工厂内使用Javascript声明一些方法，内部抛出错误，逼迫调用者必须去重写
 3️⃣ 子类的构造函数通过”构造器“结合参数而获得自己的构造方法

##### 实战场景
1️⃣ 实现一个饮料冲泡的例子

##### 关键词：
`接口类` `模板`  `子类可以通过传参，父类结合参数返回构造器，实现向上转型`

___
### 享元模式 与 对象池
当一个功能中需要创建大量的相同对象的时候，利用直接修改实例上属性的方式重用实例，以实现尽可能少地去创建对象

##### 设计重点
1️⃣ 维护好一个需要的实例化的类。  
2️⃣ 实例化尽可能少的实例。
3️⃣ 使用直接修改实例上的属性的方式实现对象的重用。

##### 最佳实践
1️⃣ 区分好内部状态与外部状态的区别    
2️⃣ 需要享元模式 和 对象池模式结合  
##### 实战场景
1️⃣ 超多个文件上传，需要通过一个文件管理对象，创建对应的DOM对象时候，针对一种上传模式只需要创建一个文件管理对象。比如都包括 filename、size等属性。  
2️⃣ 地图模块的marker点，第一次搜索结果需要画10个点，创建10个marker对象。第二次搜索结果需要画15个，我们就可以重用上一次已经创建的十个点。(前后两次结果不叠加显示)
___
### 职责链条模式
当多解决一个问题的策略有多个，但是当前只有一个是合适的，而且多种策略之间是存在着业务的先后关系的。A ==> B ==> C 条件逐渐放宽，在使用条件分支的时候，就像是一条链条。

##### 最佳实践 
1️⃣ 用于消除长长的条件分支与语句   
2️⃣ 首先也是要基于每一种策略的封装，然后自检测，若失败则让下一层去执行   
3️⃣ 使用一个中转者，和方法借用实现责任链上前后任务的解耦   
4️⃣ 使用堆栈管理任务，可以实现责任链中的异步操作    
5️⃣ 也可以使用 `AOP` `fn.after` `fn.before` 实现职责链 

##### 实战场景
1️⃣ 电商网站根据会员的等级不一样，对同一个商品的售卖行为不一样

##### 关键词 
`消除分支` `只管入口`


___
### 装饰模式
装饰模式主要的目的在于不修改原来的封装或者设定，在切面上进行添加新功能，修饰新功能。

##### 设计重点 
1️⃣ 第一种实现：在对象的方法的原型上设定一个AOP函数，做好切面接口，调用的时候给切面函数传入回调，以实现装饰添加新功能的效果。  
2️⃣ 另一种实现：先保存原方法的引用，再新申请一个方法，包含旧方法的执行和新方法的修饰内容。

##### 实战场景
1️⃣ 旧代码的重构或者添加新功能时候，要小心保持旧代码的完整。

##### 关键词 
`AOP` `新旧开发解耦`
___
### 中介者模式
近似于`发布-订阅模式`的变形版本，将更多的业务代码移动到了中介者这里（特别是那些维护各个调用者状态的代码），各个调用者只管执行行为，而不用去想这些行为会造成哪些对象的变化。

##### 设计重点 
1️⃣ 维护一个中介者，将一些所有对象都共同拥有的方法抽取到中介者对象上。   
2️⃣ 中介者对象上的方法，负责维护那些各个对象都关心的其他对象的属性与状态。  
3️⃣ 各个对象执行动作后，通过`发布订阅模式`事件模式通知中介者
4️⃣ 中介者再根据事件去修改相应的所有对象上的状态
5️⃣ 修改状态一操作，对各个对象都是透明的

##### 实战场景
1️⃣ 网络游戏中对战，每个玩家只管操作出招，发射子弹，结果的处理完全交给中介者去判定

##### 关键词 
`升级版发布订阅` `对象解耦`
___
### 状态模式
状态模式抽象地理解为，调用者对一个封装好的内部类进行同一个操作的时候，内部类会根据现有的情况而发生不同的效果。

##### 设计重点 
1️⃣ 首先确定所有的状态，然后将每一种转状态封装好，对外都提供统一的对象方法切换到另一种状态。 
2️⃣ 然后再Context类中维护一个对象属性，指向当前Context所处的状态  
3️⃣ Context类中再维护一个方法，去调用状态类上的方法，以改变当前状态。  
4️⃣ 调用者只需要调用，Context实例对外暴露的唯一方法去切换状态

##### 实战场景
1️⃣ 音乐播放器的`单曲循环--列表循环--单曲播放`模式切换按钮功能的切换。  
2️⃣ 文件上传的`暂停/开始` 配合 `删除` 按钮的使用。

##### 关键词 
`多装状态切换` `多状态依赖` `环境类抽象`
___
### AOP编程
```js
// 在原型链上修改，给所有函数都绑定 after函数
// 注意在执行 after的时候，原函数也会被一并执行
Function.prototype.after = function(afterfn){
    let _self =this;
    return function(){
        // 执行原方法
        let result = _self.apply(this,arguments);
        // 额外添加 after 函数的执行
        afterfn.apply(this,arguments);
        return result;
    }
}
```
___
### 单一职责原则
1️⃣ 一个对象只做一件事情
2️⃣ 并不是所有的职责都应该一一分离
3️⃣ 注意两个操作总是前后在一起，一个变化另一个也要跟者发生变化，那么就没有必要分离  
4️⃣ 优点是可以降低单个类的复杂程度，明确职责，分解更小的粒度。

例子：`单例模式` `遍历器模式` `中介者模式`

___
### 最少知识原则
1️⃣ 一个实体应该尽可能少地与其他实体发生相互作用。
2️⃣ 一个命令的发出者，并不想知道最后这个命令的执行者是如何执行的，发出者只是想要结果。  

例子：`命令模式 - 宏命令`  `责任链模式 - 只知入口`
___
### 开放封闭原则
1️⃣ 软件实体（模块、类、函数）都应该是可拓展的，但是不可修改的。  
2️⃣ 使用切面编程(AOP)实现不修改源代码，在切面上增加我们的新业务代码。  
3️⃣ 在可以不修改大批量源代码(业务代码)的情况下，可以使用少量改动就实现的功能，尽量使用简单的方法。 
4️⃣ 使用对象的多态性，消除大量的`if-else` `swicth-case` 语句。  
5️⃣ 使用挂钩(hook)去分离耦合，当触发到hook的时候，通过某中方式暴露出事件与变化。
6️⃣ 天然支持异步的Javascript中，我们当然还可以使用最熟悉的`回调函数`去实现分离。  

例子：`AOP编程` `发布订阅模式` `模板方法(向上转型)` `策略模式 - 多个曾略分离` `对象多态消除分支语句` `使用hook` `使用回调函数` 

___
### 面向接口编程
1️⃣ Javascript开发中很少人去真正关心对象的类型，对象的多态性是与生俱来的。而很多静态语言中，有些设计模式就是要去`隐藏类型`而实现的。  
2️⃣ 使用Typescript去实现Javascript中静态类型检查的需求  

___
### 代码重构
当你接手一些旧代码，需要按照新的模式重构的时候，你会从哪些代码先下手✋呢？

1️⃣ 提炼函数
♈️ 避免出现功能复合的超大重型函数  
♈️ 有必要的话，拆分出单独的函数以重用  
♈️ 独立出来的函数便于重用，使用良好的命名。  

2️⃣ 合并重复的条件片段
3️⃣ 提炼重复的分支语句，合并为函数
4️⃣ 使用策`略/遍历器模式`消除`分支与嵌套` 
5️⃣ 使用`拦截式(符合条件就return掉)`执行代替大量的分支语句
6️⃣ 使用对象整合的办法，使得参数合一，传参变得更简单  
7️⃣ 不要使用三目运算符代替简单的条件分支  
8️⃣ 拆分大型的条件分支，当分支其实是并列的时候，维护一个JS对象策略库，`key-value`去实现。

___
### 参考资料
《Javascript设计模式与开发实践》 -by 曾探 - [传送门](https://item.jd.com/11686375.html)
