# es6_类的继承

## 创建子类
* 子类必须在`constructor`中使用 `super`关键字调用父类的构造方法，因为子类没有自己的`this`对象，必须调用父类的
否则报错
```error
VM3089:2 Uncaught ReferenceError: Must call super constructor in derived class before accessing 'this' or returning from derived constructor
    at new myPoint1 
```
* 


