#   函数的柯里化
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

参考文章 : 
https://www.zhangxinxu.com/wordpress/2013/02/js-currying/
https://juejin.im/post/5b58b5c56fb9a04fa560ec4b