# 闭包
> 工作一年后再聊聊闭包
## 一句话概括什么是闭包
* 闭包就是能够读取其他函数内部变量的函数.
* 或者子函数在声明之外的地方被调用，子函数所在的父函数的作用域不会被释放。（也就是保存了子函数声明时候，引用了父函数的变量的值）
* 闭包是指一个有权访问另一个函数作用于中的变量的函数
## 存在的原因
* 因为`javascript`没有动态作用域，而闭包的本质是动态作用域。
* 静态作用于查找的是一个变量声明时候，依赖源程序中块之间的静态关系。
## 闭包的特性
* 使用闭包，只需要简单滴将一个函数定义在另一个函数内部，并将它暴露出来。要暴露一个函数，可以将它返回或者传递给其他函数。
## 应用场景
* 抽象场景: 内部函数能够访问到外部函数作用域中的变量，即使外部函数已经执行完毕。
* 数据私有化
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
* 偏函数
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
* 柯里化
## 注意点
* 闭包不一定需要用`IIFE(立即执行函数)`去实现
* 只要在函数内部，嵌套内部函数，内部函数引用了函数作用域的变量，并且把这个函数暴露到外面去。
* 在内部函数，对外部函数中的变量进行引用后，使得JS在进行垃圾回收的时候，不仅将内部函数引用的变量释放掉

## 闭包相关的其他点
* 变量对象 与活动对象
   * 函数声明后，(`函数的参数` + `函数内声明的变量`  + `函数内声明的函数`)共同组成了函数的 `变量对象`，函数的变量对象在函数没有执行之前，都是不能够被访问的。 
   * 函数被执行过后，函数的变量对象就被转化为`活动对象`，也即是环境中定义的所有变量和函数，在执行前被称作`变量对象`在执行后，被称为`活动对象`。
   * `活动对象`相当于`变量对象`在真正执行时的另一种形式。

## 闭包引用量的释放
* 我们在闭包中引用的变量，JS的回收机制不会主动的进行释放，当达到一定量后，会引起内存泄漏
* 我们可以选择手动置空，注意是将闭包本身置空，而不是将不包内部的变量进行逐一释放。
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
## jQuery的全局包是闭包吗？
```js
;(function($){// 可以去掉开头的 ; （分号），国外的开发人员编写的插件时的一种习惯 
     $.fn.pluginName = function() {     
           // Our plugin implementation code goes here.     
     };
})(jQuery);  
```
* 以上的例子里，在全局环境之上新建了一个二级的作用域，从而避免了在全局上丁一过多的变量。
* 但是以上出现的并不是闭包

## 闭包的实际原理是什么呢？
* 闭包的实现原理，根本上来说是[作用域链](../js/[[SCOPE]].md)
* 每一个函数(包括全局和自定义函数)，在词法解析阶段，都会有自己的词法作用域。当我们调用一个函数的时候，若该环境没有被js回收机制回收时，则我们仍可以通过其来引用它原始的作用域链。

## 一些实例分析
* 实例① 
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
* 实例②
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
         console.log('value changed'); 
    }
    return {
        doSomething,
        doAnother
    }
}
```
