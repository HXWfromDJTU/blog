## Q & A
#### 一句话概括什么是闭包
1. 闭包是指一个有权访问另一个函数作用于中的变量的函数。     
2. 或者子函数在声明之外的地方被调用，子函数所在的父函数的作用域不会被释放。（也就是保存了子函数声明时候，引用了父函数的变量的值）

#### 为什么需要闭包
1. 因为`javascript`没有动态作用域，而闭包的本质是动态作用域。
2. 静态作用域查找的只是一个变量声明时候，依赖源程序中块之间的静态关系。

#### 闭包的特性
使用闭包，只需要简单滴将一个函数定义在另一个函数内部，并将它暴露出来。要暴露一个函数，可以将它返回或者传递给其他函数。

#### 经常混淆的点
1. 闭包不一定需要用`IIFE(立即执行函数)`去实现
2. 只要在函数内部，嵌套内部函数，内部函数引用了函数作用域的变量，并且把这个函数暴露到外面去。
3. 在内部函数，对外部函数中的变量进行引用后，使得JS在进行垃圾回收的时候，不会将内部函数引用的变量释放掉
4. jQuery的全局包是闭包吗？
   ```js
   ;(function($){ 
        $.fn.pluginName = function() {     
              // Our plugin implementation code goes here.     
        };
   })(jQuery);  
   ```   
  * 以上的例子里，在全局环境之上新建了一个二级的作用域，从而避免了在全局上定义过多的变量。

## 闭包的实际原理
 闭包的实现原理，根本上来说是[作用域链](../js/[[SCOPE]].md)，我们还需要简单了解一下名词
 #### `变量对象` 与 `活动对象`
   * 函数声明后，(`函数的参数` + `函数内声明的变量`  + `函数内声明的函数`)共同组成了函数的 `变量对象`，函数的变量对象在函数没有执行之前，都是不能够被访问的。 
   * 函数被执行过后，函数的变量对象就被转化为`活动对象`，也即是环境中定义的所有变量和函数，在执行前被称作`变量对象`在执行后，被称为`活动对象`。
   * `活动对象`相当于`变量对象`在真正执行时的另一种形式。
#### 综合理解
 每一个函数(包括全局和自定义函数)，在词法解析阶段，都会有自己的词法作用域。当我们调用一个函数的时候，若该环境没有被js回收机制回收时，则我们仍可以通过其来引用它原始的作用域链。

## 闭包引用量的释放
1. 我们在闭包中引用的变量，JS的回收机制不会主动的进行释放，当达到一定量后，会引起内存泄漏
2. 我们可以选择手动置空，注意是将闭包本身置空，而不是将不包内部的变量进行逐一释放。
   ```js
    var counter = (!function(){
       var num = 0;
       return function(){ return  ++num; }
    }())
    var n = counter();
    n(); 
    n();
    n = null;  // 清空引用，等待回收
   ```
3. 但其实闭包的内存泄露并不是因为闭包自身的机制，而是来源于某些浏览器针对DOM和BOM对象使用的是引用计数回收，当两个对象相互引用的时候，自然就发生了计数永不为零，而永远占用空间的情况。

## 实例辅助理解
##### 实例① 
   ```js
   var outerValue = 'globalValue';
   var later;
   function outFunction() {
     var innerValue = 'innerGlobal';
     function innerFunction(param){
      console.log(outerValue,innerValue,param,outter2);
     }
     // 向外暴露
     later = innerFunction;
   }
   console.log('outter2:',outter2);
   outFunction();
   later('paramValue');
   var outter2 = 'outter2';  
   later('paramValue2');
   //  outter: undefined  
   // globalValue  innerGlobal paramValue undefined
   // globalVlaue innerGlobal paramValue2 outter2
   ```

  ##### anwser Q1
  ① 首次传入时，外层最`fun`函数的变量对象转变为活动对象时，n值为1,o未被赋值所有为`undefined`，所以打印出`undefined`  

  ② 此时最外层`fun`函数内部的活动对象，`n`值为`0`，`m`值为`undefined`，`o`值为`undefined`。   
  所以第二次调用时，传入`1`，活动对象中的`n`值被修改为`1`，但①中递归返回的最内部的`fun(m,n)`，其实是执行了`fun(undefined,0)` ，所以打印出来的是`undefined` ，然后当前此次调用返回的是`fun(undefined,1)`。

  ③第三次调用时，注意看，调用对象还是`a`，所以依托的环境还是①执行后的活动环境。同样输出 `0`

  ④第四次调用时，同③

  anwser: `undefined 0 0 0`   

##### 实例②
 ```js
   function foo() {
     // 内部参数
       var something = "cool"; 
       // 读取内部值
       var another = [1, 2, 3];
       function doSomething() {
            console.log( something ); 
       } 
       // 修改内部值
       function doAnother(feeling) {
         something = feeling
         console.log('value has changed to ' feeling); 
    }
    return {
        doSomething,
        doAnother
     }
  }
  var F = foo();
  F.doSomething();  // cool
  F.doAnother("hot");  // value has changed hot
  F.doSomething();   // hot
```
##### Q2
①与Q1不一样的是，Q2使用的是链式调用的形式，后一次使用的是前一次调用修改后的活动环境。

② Q1中，只有第一次修改到了`o`的值，后三次都是继承第一次调用后的活动环境。

③ 同Q1中的②解释，第二次、第三次链式调用，都是用的是上一次返回的`fun(m,n)`，所以四次调用的实际情况别是`fun(undefined,0)`、`fun(undefined,1)`、`fun(undefined,2)`、`fun(undefined,3)`，`undefined`位置替代的是`m`的值，后三次调用的时候，分别也传入了，1、2、3来替代这个`undefined`的值，输入后也成功修改到了外层`fun`函数活动变量中的`n`值

anwser: `undefined 0 1 2`  

##### 实例③
  ```js
  function fun(n,o) {
    console.log(o);
    return {
      fun:function(m){
        return fun(m,n);
      }
    };
  }
  var a = fun(0); a.fun(1); a.fun(2); a.fun(3); //Q1
  var b = fun(0).fun(1).fun(2).fun(3); // Q2
  var c = fun(0).fun(1); c.fun(2); c.fun(3); //Q3
  ```

##### anwser Q3
① 注意函数调用完，若没有后续操作，当前的作用域就被释放了。若有，则后者可以延续当前的作用域中的参数。   

② Q1: `undefined 0 0 0` 作用域始终停留在第一次 `fun(0)` 产生的 a 中。

③ Q2: `undefined 0 1 2` 后续调用延续前面的作用域。    

④ Q3: `undefined 0 1 1`


## 说了那么多，我什么时候该使用闭包呢？

##### ① 需要面向对象编程的时候 
使用对象原型和使用闭包封装，在对象实例化后，和闭包环境执行之后，都能够实现`面向对象`来构建数据对象，实现对数据声明环境的通过特定方法操作内部数据效果。    
##### 原型模式
   ```js
  function Viechel() {
         this.speed = 100;
     }
   Viechel.prototype.speedUp = function() {
       this.speed += 10;
   }
   //  实例化对象
   var car = new Viechel();
   ```   
##### 闭包模式
```js
function viechel() {
    var speed = 100;
    return {
        getSpeed: () => speed,
        speedUp: function() {
            speed += 10;
        }
    }
}
// 执行闭包
var car = viechel();
 ```
##### 优劣势对比：
`初始化`   
     使用闭包在执行的时候，变量对象变为活动对象的过程中，可能需要执行大量代码。而原型链的形式，在实例化的时候都只是把构造函数执行一次。也即是，在初始化的时候，原型的形式的效率更高。
`调用时`   
在初始化之后，调用方法时，原型上的方法存放在原型链上，寻址速度会略慢。所以在调用上，闭包的形式优于原型的形式。
#####  场景区分
1️⃣ 构建的对象实例化数量少，但是经常需要调用内部方法的时候，请使用闭包。（比如：自定义函数库，页面中banner的控制，大数据监控屏中--各个模块的数据的控制器）    
2️⃣ 若是实例化数量比较多的，一般只需要注入信息，调用方法较少的，请使用对象原型。(比如封装好的`msgCard`组件，时间轴组件等等）

##### 1-2 数据私有化（创造一个块级作用域）
   ```js
   // 一个希望封闭的对象
   const privateZone = (secret) =>{
       return {
           get:()=>{secrte}  //对往外的数据接口
       }
   }
   var obj = private(); // 返回一个对象
   var secert  = obj.get();  // 使用闭包对外的接口，也就是对内部数据访问的特权方法。
   ```  
##### 1-3 函数的封装与改造(例子：偏函数)   
在调用一个函数的时候，传入了多个参数，返回时返回带少数参数的一个函数。
使用分步返回函数，可以实现参数的分步输入。
```js
    const partialApply = (fn, ...fixedArgs) => {
       return function (...remainingArgs) {
       // 声明时的参数，与调用时的参数合二为一
      return fn.apply(this, fixedArgs.concat(remainingArgs));
      };
  };
```

##### ② 给页面上多个DOM循环绑定事件的时候
```js
// 经典用法，不多解释
for(var i=0;len =btns.length;i<len;i++){
  (function(i){
     btns[i].inclick = function(){
       alert(i)
     }
  })(i)
}
```   


##### ③ 手动延长某些局部变量的寿命
>例子实现一个图片的异步创建与加载
```js
var report = function(src){
  var img = new Image();
  img.src = src;
}
report('http://api.getImgInfo');
// 当report执行完成后，img对象则被释放
```

```js
var report = (function(){
   var img = new Image();
     return function(src){
         img.src = src;
   }
})()
```
##### ④一般的设计模式
在许多的设计模式中，闭包都有广泛的应用。
闭包通常是在过程中以环境的形式包含了数据，因此通常面向对象能够实现的功能，使用闭包也可以实现。  



## 参考文章  
[1] [闭包面试题 - 小小沧海](https://www.cnblogs.com/xxcanghai/p/4991870.html)  

[2] [Javascript高级程序设计 - 第三版]()