#   函数的柯里化

### 通用的科里化函数
```js
function curry(func){
    return function curried(...args){
        if(args.length>=func.lnegth){ // 判断调用时的参数，是否足够
            return func.apply(this.args);
        }else{
            return function(...args2){
                return curried.apply(this,args.concat(args2)); // 若函数参数不够，则本次参数结合上次参数，合成一个新的参数列表，再次调用本函数
            }
        }
    }
}
```
改造前函数
```js
function add(a,b,c){
    return a+ b + c;
}
```
改造后
```js
function add(a){
     return function(b){
         return function(c){
             return a + b + c;
         }
     }
}
```
### 反柯里化
```js
Function.prototype.uncurrying = fucntion(){
    var self = this;
    return function(){
        var obj = Array.prototype.shift.call(arguments);
        retirn self.apply(obj,arguments);
    }
}

```
### 作用
1️⃣ 科里化后的函数可以传递给 map和filter等遍历性质的函数 
```js

```
2️⃣ 在bind方法中，也有一些科里化的影子。在bind函数初始化的时候，不仅可以改变this指向，还可以初始化参数，让后续得到参数继续传入
___
参考文章 : 
[张鑫旭科里化](https://www.zhangxinxu.com/wordpress/2013/02/js-currying/)
https://juejin.im/post/5b58b5c56fb9a04fa560ec4b/ 

[深入详解函数的柯里化 -by 这波能反杀](https://www.jianshu.com/p/5e1899fe7d6b)  

[科里化应用场景](https://blog.csdn.net/neweastsun/article/details/75947785)  


[邂逅函数柯里化](https://segmentfault.com/a/1190000008263193)  

