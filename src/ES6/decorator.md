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

##### 创建 IOC 容器
所谓IOC容器，它的作用是：在应用初始化的时候自动处理对类的依赖，并且将类进行实例化，在需要的时候，使用者可以随时从容器中去除实力进行使用，而不必关心所使用的的实例何时引入、何时被创建。
```js
const container = new Container()
```

##### 绑定对象
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

#### 需要时取出实例
```js
const rabbit = container.get('rabbit')
const wolf = container.get('wolf')
// 对象的创建有可能是一个异步的过程，所以这里采用 getAsync 表示经过异步调用才能够完成的实例获取
const tigger = container.getAsync('tiger')
```

##  Javascript 中的 decorator
在`tc 39 - decorator`[原文](https://tc39.es/proposal-decorators/#sec-intro)中，笔者没有找到总结性的描述语句。这里分别引用`Python`和`TS`中对`decorator`这一特性的描述。

> A Python decorator is a function that takes another function, extending the behavior of the latter function without explicitly modifying it.   
Python装饰器是一种 能拓展另一个函数行为而不明确地修改原函数 的函数。

> Decorators provide a way to add both annotations and a meta-programming syntax for class declarations and members.    
装饰器（Decorator）是一种与类（class）相关的语法，用来注释或修改类和类方法。
 
`Python - decorator`中可以看出，其着重在`extending`与`without explicitly modifying it`上，基本上沿用了`AOP`的设计思想。

* Javascript 种 decorator 主要的用法有以下两种: `类的装饰` 、 `类方法的装饰`。 
* 修饰器不能够用于一般方法的修饰，因为方法的声明存在变量提升，修饰器方法和被修饰方法不知道哪一个会先被声明，导致装饰效果未知  
* 执行顺序：若一个方法有多个修饰器，会从外向内扫描，然后`从内向外执行`

#### 类的装饰
```js
function longHair(target) {
  target.isLongHair = true;
}

// 金发女郎，一般都是长头发
@longHair
class Blonde {
  // ...
}

Blonde.isLongHair // true
```

#### 类方法的装饰
```js
// 修改 descriptor.writable 使得对象不可被修改
function readonly(target, name, descriptor){
  descriptor.writable = false;
  return descriptor;
}

class Blonde {
  @readonly
  name() { return `${this.first} ${this.last}` }
}
```  

## Decorator 实现原理

#### babel 转码看看
我们把上面这一堆东西扔到`babel`中试了一下，得到以下内容。
![](/blog_assets/decorator-babel.png)

最后最显眼的地方出现了 Class 的 babel 实现，有兴趣的同学可以看这里的全部[源码](https://www.babeljs.cn/repl#?browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=GYVwdgxgLglg9mABAJwKYEMAmCA2BPACinWQHNUoAaRMdAW1Ws1QGcJkYAHKOZASgDeAKESJmbDt14A6AO4diAIxypEAXkTB0OFqgDcIlBRDIk49lx7IDAXyFCIOdCxaIAQjgTNEw0QAE0LFw8QxZ0PAAJVBxPRAI-H0NRCAQWOBVpT1ICAHIAC2jYxTg8Fhy-Qzs7IA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=es2015%2Creact%2Cstage-2&prettier=false&targets=&version=7.9.6&externalPlugins=)
```js
// 对类本身的修饰
var Blonde = _decorate([longHair], function (_initialize) {
  var Blonde = function Blonde () {
    _classCallCheck(this, Blonde)

    _initialize(this)
  }

  return {
    F: Blonde,
    d: [{
      kind: 'field',
      decorators: [readonly],  // 对类方法的修饰
      key: 'abc',
      value: function value () {
        return 12
      }
    }]
  }
})
// 经过多次调用后......

for (var i = decorators.length - 1; i >= 0; i--) {
      // 函数本身
      var obj = this.fromClassDescriptor(elements)
      // decorators 逐个被执行，传入的参数是一个类的模拟对象 { kind: 'class', elements: elements.map(this.fromElementDescriptor, this) }
      var elementsAndFinisher = this.toClassDescriptor((0, decorators[i])(obj) || obj)
 }
```

#### decorator 只是个语法糖
从前面的转码实验看出 ，`Decorator`语法转为`ES 5`后，其实就是使用`Object.defineProperty(target, name, description)`进行的。

针对前面的例子，其实就是执行了。

```js
let descriptor = {
  value: function(){console.log('hello boys~')},
  enumerable: false,
  configurable: true,
  writeable: true
};

// 此处也对应上述 babel 转码后展示的最后一行代码
descriptor = readonly(Blonde.prototype,'sayHello',descriptor)||descriptor;
Object.defineProperty(Blonde.prototype,'sayHello',descriptor);
```

#### descriptor
细心的你已经发现，`decorator`方法的参数 与 `Object.defineProperty`一模一样。这是因为`Javascript`中的`decorator`的设定就是后者的拦截器。     

首先获取到原对象上的`descriptor`对象属性(非额外添加的那些)，然后再执行修饰器自身，实现对原`descriptor`添加属性。类似于这样
```js
function readonly () {
  let  descriptor  = Object.getOwnPropertyDescriptor(constructor.prototype, 'sayHello')
  Object.defineProperty(constructor.prototype, 'sayHello', {
     ...descriptor,  // 保留原来的对象
     writable: false, // 进行新的修改
  })
}
```

## 日志模块的构建
针对一开始的问题，我们也写一个`Javascript`版本的解决方案吧
```js
const logger = type => {
  return (target, name, description) => {
        const originFun = description.value; // 取出原方法
        description.value = (...args) => {
            console.info('ready')
            let ret
            try {
               ret = originFun.apply(target, args) // 执行方法，并将this指向原函数
               console.log('excuted success')
            } catch (err) {
               console.log('excuted error')
            }
            return ret
        } 
  }
}
```

## 装饰模式 与 代理模式
看完了上面的内容，我们只要简单地回想一下代理模式的定义，就能轻松梳理出二者的异同点。

> 代理模式： 为其它对象提供一种代理以控制对这个对象的访问。

实际应用: 图片代理下载、缓存计算等

> 装饰模式：动态地给一个对象添加一些额外的职责。

实际应用：日志模块、模块鉴权等      

区别有以下几点: 
* 从定义上来说  
  *  代理模式仅仅是被代理方法的一层包装，对外透明。
  *  而装饰模式，却是从切面对目标方法进行功能拓展。
* 从目标对象的性质来说。
  *  代理模式中的被代理方法在设定时就已经固定了。
  *  而装饰模式的目标方法需要在调用时动态传入才能确定。
* 从调用者的感知程度来说。
  * 代理模式的基本原则就决定了调用者不需要额外学习代理方法的语法。
  * 而装饰模式，调用者需要知道装饰方法的传参规则，也需要主观地将装饰方法作用域某个方法/属性之上     

更详细的例子，推荐参考[这篇文章](http://www.jasongj.com/design_pattern/proxy_decorator/)

## 日常应用

我们日常开发中，还会有一些功能用Decorator能够优美的实现，比如`类型检查`、`单位转换`、`字段映射`、`方法鉴权`、代替部分注释`等。

#### midway 中的实现
`midway.js` 封装了许多装饰器，部分是用于实现`IOC`,如 `@provide`与`@inject`

```ts
import { provide, inject } from 'midway' // 这里 midway 也是转发了

@provide()
export class FlowerService {

    @inject()
    flowerMobel;

    async getFlowerInfo () {
        return this.flowerModel.findByIds([12,28,31])
    }
}

// 封装了和 koa-router 所支持的多种请求方法相对应的修饰器
@get、@post、@del、@put、@patch、@options、@head、@all
```



## 总结
* 代理模式制作包装转发，而装饰模式主要会对目标函数进行切面拓展。   
* `依赖注入`只是`IOC`思维实现的一种表现，而`装饰器`只是`依赖注入`的一种实现手段。  
* Decorator是Javascript未来发展的趋势，也会是Javascript逐渐实现静态检查的里程碑式的特性 


## 参考文章
[1] [我们来聊聊装饰器 -by 讶羽](https://juejin.im/post/5bec22ad5188254d070bd9e8) 

[2] [JS 装饰器实战 -by 芋头](https://zhuanlan.zhihu.com/p/30487077)

[3] [ES6 教程 -by 阮一峰](http://es6.ruanyifeng.com/#docs/decorator)

[4] [ES7 Decorator 装饰器 | 淘宝前端团队](https://segmentfault.com/p/1210000009968000/read)

[5] [什么是面向切面编程AOP？ - 柳树的回答 - 知乎](https://www.zhihu.com/question/24863332/answer/350410712)

[6] [什么是面向切面编程AOP？ - 夏昊的回答 - 知乎](https://www.zhihu.com/question/24863332/answer/863736101)

[7] [tc39 - decorator 原文](https://github.com/tc39/proposal-decorators/blob/master/README.md)






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
6️⃣ 
