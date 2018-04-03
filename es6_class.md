# es6_class

#### 静态方法
 * static 关键字声明静态属性
 * 类声明后可以直接调用静态方法，在类的实例中，反而是访问不到静态方法的
* 静态方法中的 `this`关键字，也是指向类本身，而不是指向实例
* 静态方法与非静态方法还可以重名
* 类的静态方法可以被其子类所继承
* 子类也可以通过 `super`关键字来调用父类，进而调用父类的静态方法

#### 类的静态属性
* 静态属性的定义，不同于静态方法，不能够在类中直接使用 `static`关键字声明
* 使用
```js
   class DemoClass{
       //bala bala
   }
   DemoClass.prop = "123"; ///静态属性
   //=====以下都是错误写法========
   class DemoClass {
       static prop:123,
       prop 123
   }
//=====正确的写法，新写法，注意使用等式，而不是键值对形式========
class DemoClass{
    static porp = 123;
}
```
#### 类的实例属性
* 类的实例可以直接使用`等式`，写入类的定义之中
```js
//以下代码需要 babel转译，目前浏览器不直接支持
class MyClass {
  myProp = 42;
  constructor() {
    console.log(this.myProp); // 42
  }
}
```
* 注意，实力的属性同样不需要使用 `static`关键字

### new.target 属性
* 在类中 `new.target`属性总是指向类本身 ，当使用`new`命令进行实例化的时候，`new.target`则指向类本身
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
* 利用这个特性可以编写出，只用于继承(抽象)，但不用于直接创建实例的`class`
```js
    class CanOnlyBeExtendClass{
        if(new === CanOnlyBeExtentClass){
            throw new Erroe("this class can not be invoked by new  ~_~ ");
        }
        // sth can be extended
    }
```







