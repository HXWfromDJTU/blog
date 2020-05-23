# Decorator
本文的主角是`decorator`,字面意思是`装饰器`。前端的同学大概都知道，它当前处于`stage 2`阶段([草案原文](https://github.com/tc39/proposal-decorators/blob/master/README.md))，可以用`babel`进行[转码](https://www.babeljs.cn/repl#?browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=AIFwpgziCGBGA2YBQBje0IQAQAUwCcIB7AOywG8ksth8xoATU-ATyppNLBIFcBbAnETsS0AQAoAlBSx0QPfGQAGAEnIgAFgEsIAOgBmWwiAC-WNZp270UE0qwmkJoA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=es2015%2Creact%2Cstage-2&prettier=false&targets=&version=7.9.6&externalPlugins=)后进行使用。

使用过`Angular 2`或者`Nest.js`（或者`Midway.js`）的同学，一定对`@Component`、`@Inject`、`@ViewChild`和`@get()`、`@post()`、`@provide()`不陌生。

了解设计模式的同学，大概还记得`修饰器模式`这东西，也许至今也还分不太清楚它和`代理模式`的差别。    

但这次，我们想要追本溯源，从`AOP`、`IOC`和`descriptor`这些东西说起，认识一下`修饰器`这个熟悉的陌生人。      

## "脑壳疼"de问题
在正文开始之前，我们先来一个需求，我们将陆续用不同阶段的思维去实现这个要求。
> 要求是：已知一个超过10几个人维护的代码，在不修改原函数的情况下，如何实现在每个函数执行后打印出指定内容的一行日志。
## AOP
> In computing, aspect-oriented programming (AOP) is a programming paradigm that aims to increase modularity by allowing the separation of cross-cutting concerns. It does so by adding additional behavior to existing code (an advice) without modifying the code itself, instead separately specifying which code is modified via a "pointcut" specification. 

以上是维基百科对`AOP`的基本解释，主要着重于以下几点    
* 将`横切关注点`与中体业务的进一步分离。    
* 在`现有代码的基础上`，通过在`切入点`增加`通知`的方式实现。          
* 减少`与主体业务没有这么密切的代码`对`主题代码`的入侵。   

了解过`Javascript 高阶函数`的同学，可能见到过以下方式对👆题目需求的实现。

```js
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
实现过程本身不做过多解释，主要思维是将`要添加的行为`和`目标函数(主函数)`包装到了一起，实现了不对`原函数(主函数)`入侵的预期，但写法上仍不够`优雅`。

### Spring AOP
在《Spring实战》第四章中提到了
> 散布于应用中多处的功能（日志、安全、事务管理等）被称为横切关注点。
>
>把横切关注点与业务逻辑分离是AOP要解决的问题。


在`Spring`中的`AOP`实现，给调用者的实际已经是经过`加工`的对象，开发者表面上调用的是`Fun`方法,但其实`Spring`为你做的是`a + b + c --> Fun -->d + e + f` 的调用过程。这里的`abcdef`都是函数动态的编入点，也就是定义中描述的`pointcut`。

我们称这种切入方式为`运行时织入`。

##### Spring AOP 的织入点
* 前置通知（Before Advice）
* 后置通知（After Advice）
* 返回通知（After Return Advice
* 环绕通知（Around Advice
* 抛出异常后通知（After Throwing Advice）

```java
// 基本实现代码
try{
    try{
        //@Before
        method.invoke(..);
    }finally{
        //@After
    }
    //@AfterReturning
} catch() {
    //@AfterThrowing
}
```

## IOC 与 DI
> 控制反转，是面向对象编程中的一种设计原则，可以用来减低计算机代码之间的耦合度。其中最常见的方式叫做依赖注入，还有一种方式叫“依赖查找”。通过控制反转，对象在被创建的时候，由一个调控系统内所有对象的外界实体，将其所依赖的对象的引用传递给它。

以上是来自于维基百科对”控制反转“的基本解释。那么，我们如何实现一个控制反转呢，需要了解以下几个关键步骤。

#### 创建 IOC 容器
所谓IOC容器，它的作用是：在应用初始化的时候自动处理对类的依赖，并且将类进行实例化，在需要的时候，使用者可以随时从容器中去除实力进行使用，而不必关心所使用的的实例何时引入、何时被创建。
```js
const container = new Container()
```

#### 绑定对象
有了容器，我们需要将”可能会被用到“的对象类，绑定到容器上去。
```js
class Rabbit {}
class Wolf {}
class Tiger {}
// 绑定到容器上
container.bind('rabbit', Rabbit)
container.bind('wolf', Wolf)
container.bind('tiger', Tiger)
```

### 其他语言中的decorator
* python
* java
* JavaScript中的decorator
   * 发展状况
   * 如何垫片使用

### 实现原理
* descriptor
* babel 转码后内容分析
* JS如何原生实现一个装饰器

### 工程应用
* 可以用到的地方
* 如何配置

### 装饰器模式又是什么？

### 日志模块的构建

### 与代理模式的差别





















### 简介
* 用于修改类、类方法的特征   
* 修饰器不能够用于一般方法的修饰，因为方法的声明存在变量提升，修饰器方法和被修饰方法不知道哪一个会先被声明，导致装饰效果未知   
* 无论是node还是Browser环境，目前还未支持Decorator。需要我们手动下载垫片,拖动你的页面到底部，有方法可以让你在线先体验哦...
![](/blog_assets/babel_decorator.png)

### 类的修饰
* 面向对象的语言都有修饰器函数，用来修饰其行为。   
* 一般使用一个函数作为类的修饰器   

```ts
@testable
class MyTestableClass {
  // ...
}

function testable(target) {
  target.isTestable = true;
}

MyTestableClass.isTestable
```
✂️ 修饰器的第一个返回的参数是修饰类本身
☎️ 可以在修饰器外部使用闭包封装，再传入更多参数

### 类方法、属性的修饰
> 注意：这里提到的类方法和、属性也包含类实例访问器(get/set/Configurable/Enumerable)

* 首先要区别与第一种类的修饰，类方法的修饰接收到的三个参数
* 类的原型(注意不是类哦)
* 要修饰的类方法(或者属性)的名称   

📹 descriptor对象(也就是 Object.defineProperty里面的第三个参数。
其实这里的操作基本就是未实例化版的`Object.defineProperty()操作`

2️⃣ 执行顺序：若一个方法有多个修饰器，会从外向内扫描，然后<span style="color:red">从内向外执行</span>

3️⃣ 修饰器还有注释的功能
```js
@testable
class Person {
  @readonly
  @nonenumerable
  name() { return `${this.first} ${this.last}` }
}
```
如上文代码，我们知己就能看出属性name是只读的，也是不可枚举的。(当然前提是我们在全局定义了这些常用的修饰器)
4️⃣ 在静态层面上就实现了Object.defineProperty()的功能
(类似于vue数值的双向绑定就可以在静态时直接实现了）
5️⃣ Mixin
我们先来看看一个通用的mixin修饰器
```js
// 修饰其内部使用 ”对象合体"的实现方式，将传入的属性都绑定到目标对象上
export function mixins(...list) {
  return function (target) {
    Object.assign(target.prototype, ...list);
  };
}
```
使用的时候
```js
const Foo = {
  foo() { console.log('foo') }
};

@mixins(Foo) // 直接传入想添加的属性对象
class MyClass {}
```
社区中也有更加成熟的解决方案，屏蔽掉了我们手工mixin的一些毛病(比如说同名属性被覆盖的问题)，traits-decorator，有兴趣的去看看，[传送门](https://github.com/CocktailJS/traits-decorator)
6️⃣ 我们日常开发中，还会有一些功能用Decorator能够优美的实现，比如`类型检查`、`单位转换`、`字段映射`等
### 第三方Decorator库
###### core-decorators.js 
1️⃣ @readonly  确保这个属性或者方法只是只读的
2️⃣ @overwrite 确保子类重写了这个方法
3️⃣ @deprecate 使用这个方法，在控制台会受到一个方法即将废弃的通知

💸 以上只是介绍这个库中几个常用的修饰器，更多常用修饰器，请移步[这里](https://github.com/jayphelps/core-decorators)



### Summary
* Decorator是Javascript未来发展的趋势，也会是Javascript逐渐实现静态检查的里程碑式的特性
* Decorator线上运行，[传送门](https://babeljs.io/repl)
![](/blog_assets/babel_decorator_online.png)
* 遗留的问题：`装饰器叠加`、`叠加时候的顺序`、`对于敏感的get/set属性多层修饰`

Anyway..之前一直没有啃下来的Decorator,找到应用场景和知道其远大的历史使命之后...希望大家也重视起来...

___
### 参考文章
[1] [我们来聊聊装饰器 -by 讶羽](https://juejin.im/post/5bec22ad5188254d070bd9e8) 

[2] [JS 装饰器实战 -by 芋头](https://zhuanlan.zhihu.com/p/30487077)

[3] [ES6 教程 -by 阮一峰](http://es6.ruanyifeng.com/#docs/decorator)

[4] [ES7 Decorator 装饰器 | 淘宝前端团队](https://segmentfault.com/p/1210000009968000/read)

[5] [什么是面向切面编程AOP？ - 柳树的回答 - 知乎](https://www.zhihu.com/question/24863332/answer/350410712)

[6] [什么是面向切面编程AOP？ - 夏昊的回答 - 知乎](https://www.zhihu.com/question/24863332/answer/863736101)
