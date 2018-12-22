# Decorator

### 简介
1️⃣ 用于修改类、类方法的特征
2️⃣ 修饰器不能够用于一般方法的修饰，因为方法的声明存在变量提升，修饰器方法和被修饰方法不知道哪一个会先被声明，导致装饰效果未知
3️⃣ 无论是node还是Browser环境，目前还未支持Decorator。需要我们手动下载垫片,拖动你的页面到底部，有方法可以让你在线先体验哦...
![](/blog_assets/babel_decorator.png)

### 类的修饰
1️⃣ 面向对象的语言都有修饰器函数，用来修饰其行为。
2️⃣ 一般使用一个函数作为类的修饰器

```js
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

1️⃣ 首先要区别与第一种类的修饰，类方法的修饰接收到的三个参数
💿 类的原型(注意不是类哦)
📷 要修饰的类方法(或者属性)的名称   

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

@mixins(Foo); // 直接传入想添加的属性对象
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
1️⃣ Decorator是Javascript未来发展的趋势，也会是Javascript逐渐实现静态检查的里程碑式的特性
2️⃣ Decorator线上运行，[传送门](https://babeljs.io/repl)
![](/blog_assets/babel_decorator_online.png)
3️⃣ 遗留的问题：`装饰器叠加`、`叠加时候的顺序`、`对于敏感的get/set属性多层修饰`

Anyway..之前一直没有啃下来的Decorator,找到应用场景和知道其远大的历史使命之后...希望大家也重视起来...
___
### 参考文章
[JS 装饰器实战 -by 芋头](https://zhuanlan.zhihu.com/p/30487077)

[ES6 教程 -by 阮一峰](http://es6.ruanyifeng.com/#docs/decorator)
