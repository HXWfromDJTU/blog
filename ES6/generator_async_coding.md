# generator实现异步编程

### 基本理解
1️⃣ generator可以理解为是一个状态机，封装了多个内部状态，等待外部去读取
2️⃣ 同时呢，generator也是也是一个遍历器对象(`Iterator`)生成器，执行generator会生成并返回一个遍历器对象，用于遍历读取内部的状态
3️⃣ 可以封装多个状态，这也就是generator（生成器）名称的由来

### 执行过程
1️⃣ generator初始执行时，只会返回对应的遍历器对象（Iterator Object）
2️⃣ 每一次外部执行next方法，内部的内容都会不断执行，到下一个 `yield` 或者 `return`，返回当前`yeild`或者`return`后面跟的表达式的值。
3️⃣ 从上一条看，yeild可以暂停代码的执行。
4️⃣ 若最后没有`return`值，则可以理解为`return undefined`
5️⃣ 普通函数中不能够使用 yield 关键字
6️⃣ for...of遍历可以直接将generator对象全部执行到底，而不用依次调用next方法

### generator 与 Iterator 
1️⃣ 我们知道generator除了封装状态以外，还是一个遍历器对象生成器，那么我们就可以用一个generator对象去代替一个数据的遍历器
```js
let abc = {};
function * gen(){
    yield 1;
    yield 3;
    yield 9;
}
abc[Symbol.iterator] = gen;
for(o of abc){
    console.log(o); // 1 , 2 , 3 
}
```
除了上面的 for...of之外，...拓展运算符之类所有可以触发遍历器自执行的操作，都会制动去调用我们所“设定好的遍历器”

2️⃣ generator初始化后，会返回一个generator对象，这个对象也是有Symbol.iterator属性的，指向的也是generator方法本身

### 初始化与next传参
1️⃣ 初始化传参于正擦很难过函数执行传参一样
2️⃣ next操作的参数，会替换上一次yeild操作的结果，看例子可以理解，当然，第一次执行next的时候，next的参数是没有意义的，V8引擎也会选择忽略。
> 例子摘选自 [阮一峰 ES 6](http://es6.ruanyifeng.com/#docs/generator)

```js
function* foo(x) {
  var y = 2 * (yield (x + 1));
  var z = yield (y / 3);
  return (x + y + z);
}

var a = foo(5);
a.next() // Object{value:6, done:false}
a.next() // Object{value:NaN, done:false}
a.next() // Object{value:NaN, done:true}

var b = foo(5);
b.next() // { value:6, done:false }
b.next(12) // { value:8, done:false }
b.next(13) // { value:42, done:true }
```

### throw 与 catch 
1️⃣ generator初始化生成的对象，原生部署乐意throw方法，抛出异常，这些异常只能够在generator方法体内部捕获到
2️⃣ 外界window下的throw方法包裹的generator.next()执行，若发生错误，也是在外部的catch才能够捕获到。但是gen函数体内的方法都是可以通过外部部署的try...catch所捕获到的，但是捕获过程不在gen内部，后续的yeild也就不可能再执行，往后再执行next方法则会返回`{value:undefined,done:true}`
3️⃣ generator上的throw方法抛出的错误，也必须generator至少执行过一次next()方法，才能被内部捕获得到。
4️⃣ generator内部只要布置有try...catch语句，外部gen.throw抛出的错误都会被内部捕获到，那么也就不会影响下一次的next()操作
5️⃣ 只要在generator内部部署一次 try...catch就可以为所有的yield语句都做保障

### return方法
1️⃣ gen.return()方法立即结束gen的遍历，返回所传入的值
2️⃣ 若是代码块中存在 finally语句，需要小心处理。若代码的执行栈中，已经执行到了try...catch...finally模块，则会等待finally中的语句执行完后再执行return,本次的return就相当执行了一个next。一旦finally中的内容执行完了，那么next出来的就是刚才强行插入的return得值。

### throw return next相同点
1️⃣ 都是将 yield替换为一个对应的内容
2️⃣ throw是将yeild替换为一个 `throw(new Error(123))`语句
3️⃣ next是将yeild替换为一个值
4️⃣ return 是将 yield替换为一个return语句


### 应用
1️⃣ 使用同步代码编写异步程序
3️⃣ 相对于Promise的特点在于能够改善多个异步操作之间前后依赖的情况，并不需要任何的嵌套和回调函数，简洁明了
3️⃣ 用于部署自定义的 Iterator 接口，注意在初始化generator的时候将需要便利的对象传入即可。
4️⃣ 把generator看做一个类数组的数据结构，内部存放的值是有序的，每个都要yield暴露出去，使用的时候，可以像数组一样，使用for...of进行遍历就很好了。



### thunk
1️⃣ thunk的概念就像是，使用“传名调用”的一种实现策略，传入的参数在被调用的时候才会被执行。
2️⃣ thunk在JavaScript中实现的不是“传值调用”，而是实现“多参合一”的这一个效果，而且这个参数一般为callback
3️⃣ thunk的设计思想逐渐演变为generator的执行器的角色。

### co模块与generator的自执行
1️⃣ co模块会检测传入的对象是否是generator对象，若不是则返回一个resolve状态的promise
2️⃣ co模块内部会封装gen对象的next方法，并且try...catch处理
3️⃣ 内部封装的next函数会不断地调用自身，每一次的参数都是上一次next返回的结果
4️⃣ 处理并发的异步操作，比如说同时返回了三个generator函数。（例如，分批地去读取Stream中的数据）


### 实战
1️⃣ koa框架中，使用generator yield实现接口的异步调用
```js
* getTodolist(ctx) {
  const id = ctx.params.id // 获取url里传过来的参数里的id
  const result = await todolist.getTodolistById(id) // 通过await “同步”地返回查询结果
  ctx.body = {
    success: true,
    result // 将请求的结果放到response的body里返回
  }
}

* createTodolist(ctx) {
  const data = ctx.request.body
  const success = await todolist.createTodolist(data);
  ctx.body = {
    success
  }
}

```