# @Decorator & IOC & Dependency Injection

> 工作中第一次接触到@decorator是在 `ng2` 中([笔记✈️](/src/ES6/decorator.md))。最近因为工作，重新接触了 ts 上手了 midway.js 和 nest.js 重新见到了久违的 @decorator。所以决定把 @Decorator 到 依赖注入 还有 IOC 几个概念理一理。


### @decorator
> Decorators provide a way to add both annotations and a meta-programming syntax for class declarations and members. 

> 装饰器（Decorator）是一种与类（class）相关的语法，用来注释或修改类和类方法。

上面的描述摘自`Typescript`官网([传送门✈️](https://www.typescriptlang.org/docs/handbook/decorators.html))和`阮一峰 ES 6`([传送门✈️](https://es6.ruanyifeng.com/#docs/decorator))中对`decorator`的描述。

`decrotor`主要的用法有以下两种: `类的装饰` 、 `类方法的装饰`。

### 类的装饰
```js
function hasLongHair(target) {
  target.isLongHair = true;
}

// 金发女郎，一般都是长头发
@hasLongHair
class AmericanBlondeClass {
  // ...
}

AmericanBlondeClass.isLongHair // true
```

### 类方法的装饰
```js
// 修改 descriptor.writable 似的对象不可被修改
function readonly(target, name, descriptor){
  descriptor.writable = false;
  return descriptor;
}

class AmericanBlondeClass {
  @readonly
  name() { return `${this.first} ${this.last}` }
}
```


### IOC 
来自于维基百科对”控制反转“的基本解释

> 控制反转，是面向对象编程中的一种设计原则，可以用来减低计算机代码之间的耦合度。其中最常见的方式叫做依赖注入，还有一种方式叫“依赖查找”。通过控制反转，对象在被创建的时候，由一个调控系统内所有对象的外界实体，将其所依赖的对象的引用传递给它。

那么，我们如何实现一个控制反转呢，需要了解以下几个关键步骤。

### 创建 IOC 容器
所谓IOC容器，它的作用是：在应用初始化的时候自动处理对类的依赖，并且将类进行实例化，在需要的时候，使用者可以随时从容器中去除实力进行使用，而不必关心所使用的的实例何时引入、何时被创建。
```js
const container = new Container()
```

### 绑定对象
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

### 需要时取出实例
```js
const rabbit = container.get('rabbit')
const wolf = container.get('wolf')
// 对象的创建有可能是一个异步的过程，所以这里采用 getAsync 表示经过异步调用才能够完成的实例获取
const tigger = container.getAsync('tiger')
```

### TS 中的实现
基本原理说完了，我们再来看看 `midwayjs`中提供各种功能的`修饰器`

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
```

```js
// 封装了和 koa-router 所支持的多种请求方法相对应的修饰器
@get、@post、@del、@put、@patch、@options、@head、@all
```

## 总结
`依赖注入`只是`IOC`思维实现的一种表现，而`装饰器`只是`依赖注入`的一种实现手段。

## 参考文章
[midway - IOC](https://midwayjs.org/injection/guide.html#%E8%83%8C%E6%99%AF)
