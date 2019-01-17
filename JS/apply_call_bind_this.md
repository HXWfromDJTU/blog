## `apply` `bind` `call` `this` 的恩怨情仇 

### this的指向

> this永远指向最后调用它的那个对象。
### 几个栗子   :nose:
##### eg1
```js
var name = "global";
    var a = {
        name: "inner",
        fn : function () {
            console.log(this.name);      
        }
    }
a.fn();   // inner
```
##### eg2
* 在`window`下，使用`var`定义的变量，都是挂在`window`下的
```js
  var name = "global";
    var a = {
        name : null,
        fn : function () {
            console.log(this.name);      
        }
    }
    var f = a.fn;
    f();  // global
```
##### eg3
* 在es 5中this永远指向最后一个调用它的对象
```js
 var name = "global";
    function fn() {
        var name = 'inner';
        innerFunction();
        function innerFunction() {
            console.log(this.name);      
        }
    }
    fn()  // global
```

### 如何改变 `this`的指向
① 使用`call`、`apply`、`bind`
② 使用`_this = this;`
③ 使用 ES6的箭头函数
④ 使用 `new` 实例化一个对象

#### apply与call的区别 <span class="tag">传参形式</span>
apply
> function.apply(thisArg, [argsArray])

call
> fun.call(thisArg, arg1, arg2, ...)
* apply和call都是改变对象的this指向，改变方法的调用对象。
* apply传参是以数组形式，call传参是以多个参数逗号分隔依次传参。

#### bind 与  call 的区别 <span class="tag">返回值和是否执行</span>
> fun.bind(thisArg[, arg1[, arg2[, ...]]])
* bind的返回值是`this指向`改造后的函数的拷贝，且不会自动执行，如有需要，请手动执行返回的函数。call返回的是`this`改造后的函数，并且立即执行。

* 二者传入参数的时候，都是使用逗号分隔依次传入。

#### apply 



#### bind
bind在某些浏览器中（看什么看，说你呢IE，站好....）没有得到实现，所以我们可以使用代码来模拟一下...
![](/blog_assets/bind_capacity.png)

<style> .tag{font-size:14px;color:red;}</style>
<!-- <script>console.log(123)</script> -->

___
### 参考文章 
[深入JS系列（一：call, apply, bind实现）](https://blog.csdn.net/u010377383/article/details/80646415)