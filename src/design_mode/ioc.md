# @Decorator & IOC & Dependency Injection

> 工作中第一次接触到@decorator是在 `ng2` 中([笔记✈️](/src/ES6/decorator.md))。最近因为工作，重新接触了 ts 上手了 midway.js 和 nest.js 重新见到了久违的 @decorator。所以决定把 @Decorator 到 依赖注入 还有 IOC 几个概念理一理。


### @decorator
> Decorators provide a way to add both annotations and a meta-programming syntax for class declarations and members. 

> 装饰器（Decorator）是一种与类（class）相关的语法，用来注释或修改类和类方法。

上面的描述摘自`Typescript`官网([传送门✈️](https://www.typescriptlang.org/docs/handbook/decorators.html))和`阮一峰 ES 6`([传送门✈️](https://es6.ruanyifeng.com/#docs/decorator))中对`decorator`的描述。

`decrotor`主要的用法有以下两种: `类的装饰` 、 `类方法的装饰`。

##### 类的装饰
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

##### 类方法的装饰
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