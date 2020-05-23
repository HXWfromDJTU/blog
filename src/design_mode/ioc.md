# Decorator AOP IOC  Injection

> 工作中第一次接触到@decorator是在 `ng2`。最近因为工作，重新接触了 ts 上手了 midway.js 和 nest.js 重新见到了久违的 decorator。所以决定把 @Decorator 到 依赖注入 还有 IOC 几个概念理一理。

### decorator
> Decorators provide a way to add both annotations and a meta-programming syntax for class declarations and members. 
装饰器（Decorator）是一种与类（class）相关的语法，用来注释或修改类和类方法。

上面的描述摘自`Typescript`官网([传送门✈️](https://www.typescriptlang.org/docs/handbook/decorators.html))和`阮一峰 ES 6`([传送门✈️](https://es6.ruanyifeng.com/#docs/decorator))中对`decorator`的描述。

`decrotor`主要的用法有以下两种: `类的装饰` 、 `类方法的装饰`。

### 类的装饰
```js
function hasLongHair(target) {
  target.isLongHair = true;
}

// 金发女郎，一般都是长头发
@hasLongHair
class Blonde {
  // ...
}

Blonde.isLongHair // true
```

### 类方法的装饰
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

// 封装了和 koa-router 所支持的多种请求方法相对应的修饰器
@get、@post、@del、@put、@patch、@options、@head、@all
```

## 总结
* `依赖注入`只是`IOC`思维实现的一种表现，而`装饰器`只是`依赖注入`的一种实现手段。
* 

## 参考文章
[1] [midway - IOC](https://midwayjs.org/injection/guide.html#%E8%83%8C%E6%99%AF)
