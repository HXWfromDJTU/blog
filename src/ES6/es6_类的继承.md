# es6_类的继承

### 子类的constructor
1️⃣ 子类必须在`constructor`中使用 `super`关键字调用父类的构造方法，因为子类没有自己的`this`对象，必须调用父类的的构造方法来得到`this`
```error
VM3089:2 Uncaught ReferenceError: Must call super constructor in derived class before accessing 'this' or returning from derived constructor
    at new myPoint1 
```

2️⃣ 或者子类可以不书写`constructor`，编译器会自动补充一个`constructor`，但这样自身的构造器就与父类构造器完全一样

3️⃣ ES 5是先创造子类一个空的this对象，然后再通过方法借用的形式调用父类构造方法，用子类this去挂在父类方法。而ES 6则是先通过`super`方法调用父类的构造方法，再通过子类的构造方法去“修饰”上一步获取到的this实例。
这里的区别就在一个先后问题。
所以在使用`super`关键字对父类进行调用前，不可以使用`this`关键字调用属性，进行性修饰

### super关键字
首先说明，`super对象`和`super()方法`是子类中super关键字的两种不同用法

1️⃣ `super()`再constructor中的作用,基本就是以下的意思
```js
Father.prototype.constructor.call(this)。
```
2️⃣ super()只能够在constructor方法中使用，在其他的子类方法中使用会报错

3️⃣ 在子类`constructor`函数中
🚗 `super`指向的是当前的子类的实例。
🚙 使用super关键字,调用父类方法的时候，this指向的是 子类的实例。

4️⃣ 在子类的普通方法中
🚗 `super`本身指向的是`父类的原型对象`，也就是Father.prototype，所以说在父类中的实例对象(也就是在父类constructor方法中使用this挂载的东西)，子类使用super是不能够访问到的。
🚙 使用super关键字,调用父类方法的时候，this指向的是 子类的实例。

5️⃣ 在子类的静态方法中
🚗 super作为对象，指向的是父类本身，而不是父类的原型原型对象，也不是父类的实例。
🚙 使用super关键字,调用父类方法的时候，方法内部的this，指向的是子类本身。


### 子类的实例
🚕 子类的实例既是子类的`实例`，也是父类的`实例`，这里的实例是我们常提到的`instance`
```js
   class Men extents Person{};
   let Tony = new Men("tony","177");
   Tony instanceof Men;   // true 
   Tony instanceof Peoson;  // true
```

### 子类可以继承父类的静态方法
🚌 如另一篇[文章](https://github.com/HXWfromDJTU/blog/blob/master/es6_class.md)第五点特性提到的，父类的静态方法可以被其子类所继承
```js
class A{
    static fatherFun = function(){
         cosnole.log("this is father static function")
    }
}
class B extends A{}
B.fatherFun(); // this is fatehr static function
```
### 获取父类
```js
  class Son extends Father{}
  Object.getPrototypeOf(Son)  === Father;  // true
```

### 小技巧
1️⃣ 使用类名直接apply，相当于调用其构造函数，变相相当与继承
```js
Father.apply(this,arguments); 
```

### 对内置类的继承
```js
// 内置类
Boolean()
Number()
String()
Array()
Date()
Function()
RegExp()
Error()
Object()
```
1️⃣ 在ES5 中是现在父类原属性与方法上修改，再生成修改后类的this,但是由于内置对象中某些方法是不可写的，所以难以实现继承
2️⃣ 在ES 6中是先新建父类的实例对象this,再在此基础性上坐修饰性修改，在对象的实例上修改，就不再受类方法的限制了。
3️⃣ 支持定继承内置对象，在业务开发时候，有利于我们定制化声明一个有特殊功能的类，比如一个有日志功能的数组类，或者一个有历史记录功能的数组类。

<!-- ![图片](/blog_assets/prototype.png) -->
