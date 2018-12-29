# let & const
![](/blog_assets/let_const.png)
___
### let
1️⃣ 利用块级作用域，在for循环中和解决闭包的问题(📣for循环变量的那部分是一个父作用域，而循环体内部是一个单独的子作用域)
2️⃣ 不存在变量提升 ==(导致)==> 暂时性死区
3️⃣ 不允许重复声明
4️⃣ 免在块级作用域内声明函数。如果确实需要，也应该写成函数表达式，而不是
5️⃣ 允许制声明但不赋值。
函数声明语句。
```js
// 函数声明语句
{
  let a = 'secret';
  function f() {
    return a;
  }
}

// 函数表达式
{
  let a = 'secret';
  let f = function () {
    return a;
  };
}

```

### const
1️⃣ 必须声明和复制在同一步，不能分拆。也不存在变量提升。
2️⃣ 使用const声明一个常亮，若值设置为一个对象要特别小心，因为对象的引用时不能够改变，但是对象的内容(结构)是能够被修改的。若是想完全冻结不让修改，请使用`Object.freeze`
3️⃣ 声明的同时必须赋值，否则会报错。

### 其他
1️⃣ ES6 的6中声明对象的方法 `var` `function` `let` `const` `import`  `class`
2️⃣ global对象的检测

___
### 参考文章
[阮一峰 ES 6 let_const](http://es6.ruanyifeng.com/#docs/let)
[let 到底有没有变量提升 - by 方应杭](https://zhuanlan.zhihu.com/p/28140450)