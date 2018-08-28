## JS类的继承
#### ES 3
1.   利用 Person.call(this) 执行“方法借用”，获取 Person 的属性
2.    利用一个空函数将 Person.prototype 加入原型链
关键代码
```js
function inheritProto(Parent, Child) {
  var Fn = function() {};
  Fn.prototype = Parent.prototype;
  Child.prototype = new Fn();
  Child.prototype.constructor = Child;
}
```
#### ES 5
 1.   利用 Person.call(this) 执行“方法借用”，获取 Person 的属性
 2.   利用 ES5 增加的 [Object.create](../JS/OOJECT_FUNC.md) 方法将 Person.prototype 加入原型链
 ###### 关键代码
 ```js
Bob.prototype  = Object.create(Person.prototype, {
  constructor: {
    value: Bob,
    enumerable: false,
    configurable: true,
    writable: true
  }
});
 ```

#### ES 6
* 利用 ES6 增加的 class 和 extends 实现比以前更完善的继承
##### 关键代码
```js
class Bob extends Person {
  constructor() {
    super("Bob");
    this.hobby = "Histroy";
  }
```

### JS的继承与Java有什么不同之处

#### Java
Java 中的类就像对象的设计图，每次调用 new 创建一个新的对象，就产生一个独立的对象占用独立的内存空间

#### Javascript
在 JavaScript，继承所做工作实际上是在构造原型链，所有子类的实例共享的是同一个原型。所以 JavaScript 中调用父类的方法实际上是在不同的对象上调用同一个方法，即“方法借用”，这种行为实际上是“委托（delegation）”调用