# new关键字都做了什么呢

### 步骤
① 创建一个新的空的对象。
② 将原构造函数的作用域赋给新的对象，这样`this`就指向了这个新对象。
③ 执行构造函数中的代码，也就是为新的对象添加各种属性。
④ 返回这个新的对象

### 代码实现
```js
function New(fun){
    return function(){
        var o = {}                           //创建临时对象
        o.__proto__ = fun.prototype;         // 将父类的作用域赋值给新对象
        fun.apply(o,arguments);                //用新的参数，继承父类的属性，调用父类的构造器，生成新的属性
        return o;                            //返回新对象
    }
}

``` 

### 小常识
1️⃣ new Person 和 new Person() 含义相同，都相当于调用了构造函数，并且给构造函数传递了一个`undefined`参数。   


