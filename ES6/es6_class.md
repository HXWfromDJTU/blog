# es6_class

### 静态方法
1️⃣ static 关键字声明静态方法
2️⃣ 类的实力无法访问类中俄静态方法
3️⃣ 静态方法中的 `this`关键字，也是指向类本身，而不是指向实例
4️⃣ 静态方法与非静态方法还可以重名
5️⃣ 类的静态方法可以被其子类所继承，也就是可以直接访问父类的静态方法
6️⃣ 子类也可以通过 `super`关键字来调用父类，进而调用父类的静态方法

### 类的静态属性

正确的写法
```js
class DemoClass{p
  //bala bala
}
DemoClass.prop = "123"; //静态属性
```
错误的写法
```JS
class DemoClass {
    static prop:123,
    prop :123
}
// 这个阮老师有提到过，但貌似浏览器还不支持
class DemoClass{
    static porp = 123;
}
```
### 类的实例属性
1️⃣ 类的实例可以直接使用`等式`，写入类的定义之中（目前浏览器暂不支持）
```js
//以下代码需要 babel转译，目前浏览器不直接支持
class MyClass {
  myProp = 42;
  constructor() {
    console.log(this.myProp); // 42
  }
}
```
要像react那样在constructor中编写this.state,那么组件实例才能够拥有这些属性。
```js
class ReactCounter extends React.Component {
  state;
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }
}
```
2️⃣ 注意，实例的属性同样不需要使用 `static`关键字

### 异同点
1️⃣ `class`的写法只是原来`es5` 的语法糖
2️⃣ `constructor`就是原来的构造函数，而`class`中的其他方法就是原来挂在在构造器原型(prototype)上的方法。
3️⃣ 在class内部声明的方法，无法使用Object.keys遍历出来，而这一点在ES 5中是可以做到的
> 以下例子来自于 [阮一峰 ES 6](http://es6.ruanyifeng.com/#docs/class)
```js
class Point {
  constructor(x, y) {
    // ...
  }

  toString() {
    // ...
  }
}

Object.keys(Point.prototype)
// []
Object.getOwnPropertyNames(Point.prototype)
// ["constructor","toString"]
```
4️⃣ class关键字声明的内容不会出现变量提升，一个类必须先声明而后使用。
5️⃣ 在class中的类方法，使用this关键字的时候，需要注意this的指向问题
6️⃣ 使用类名称点儿 className.name 可以获取到类的名称
7️⃣ 十分调皮的是，我们还可以为class设置一个 [Symbol.iterator]属性，后面自然是我们的遍历器生成器 generator啦，那么我们就可以使用for...of遍历这个“类”了（因为默认调用Symbol.iterator属性）

### constructor
1️⃣ 建议手动添加 constructor方法，若不添加，则默认添加一个空的consturctor方法，返回this对象。
2️⃣ 由constructor这里看来，ES6 class必须使用new关键字进行调用
3️⃣ 在constructor方法中我们可以获得一个new.target的属性，用于获知这个类是怎么被调用的，我们可以通过这个信息对类的实例化进行一些限制性的操作

### 私有属性与私有方法
1️⃣ ECMA没有规定私有方法的写法，也就是需要我们使用“特殊的”技巧去模拟。
2️⃣ 建议使用"_"（下划线），因为“#”没有成为正式提案，“@”用于decorator的标记。
3️⃣ 私有属性也可以拥有自己的getter与setter。
4️⃣ 当然，对象的实例，需要通过类方法来访问私有属性，而不可以直接访问。

### getter与setter
1️⃣ 可以为类的属性设置 getter和setter
2️⃣ 这些getter和setter都可以使用 getOwnPropertyDescriptor获得

### new.target 属性
1️⃣ 在类中 `new.target`属性总是指向类本身 ，当使用`new`命令进行实例化的时候，`new.target`则指向类本身
```js
 function Peoson(){
       console.log(new.target);  
    console.log(new.target === Person);  //在未实例化的时候，我们不能知道输出
 }
 var person = new Person("张三");    // true
 class Man extends Peoson{
     constructor(){
   super();//调用父类的构造函数
     }
 }
 var Tony = new Man();  // false ，使用new创建时，new.target始终指向当前的构造器constructor
```
2️⃣ 利用这个特性可以编写出，只用于继承(抽象)，但不用于直接创建实例的`class`
```js
    class CanOnlyBeExtendClass{
        if(new === CanOnlyBeExtentClass){
            throw new Erroe("this class can not be invoked by new  ~_~ ");
        }
        // sth can be extended
    }
```







