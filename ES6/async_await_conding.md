# async/await 实现异步编程

### 优点
1️⃣ `async` 是用同步的方法去写多个异步的操作，程序可读性更高。      
2️⃣ 多个异步任务时候，每个任务的结果都依赖于上一个异步任务的结果。      
3️⃣ 使用`Promise`，当出现多个异步操作，并且前后有依赖关系的时候，会出现`多层嵌套`和`超长链式调用`的问题.    
4️⃣ 使用`generator`的时候语义不够`async/await`明确，并且需要手动调用 `next()`方法进行调用      

### 内部原理
1️⃣ 可以将`async/await`理解为`星号 + generator`的语法糖，并且自带执行器
2️⃣ 执行顺序：
   ①：`await`是一种让出线程的标志，遇到了`await`标志，会把跟在后面的表达式执行一遍。
   
   ②：无论返回的是什么，都将返回值放在本轮执行的异步队列中。
   
   ③：当本轮的JS执行栈完成后，再跳去执行异步队列中的内容。
   
  ```js
   const asyncFunc = (param) => { 
	console.log('我会被第一轮第一位打印');
       return '我会在第二轮执行'
   }
   async function fn(){
    let returnValue = await asyncFunc(1000);
    console.log(returnValue);
    return '我会被在第三轮执行';
   }
   fn().then(msg=>{
      console.log(msg)
   })
   console.log('我会在第一轮第二位被打印')
  ```

### async出现的位置
```js
// 函数声明
async function foo() {}

// 函数表达式
const foo = async function () {};

// **** 对象的方法 ***
let obj = { async foo() {} };
obj.foo().then(...)

// Class 的方法
class Storage {
  constructor() {
    this.cachePromise = caches.open('avatars');
  }

  async getAvatar(name) {
    const cache = await this.cachePromise;
    return cache.match(`/avatars/${name}.jpg`);
  }
}

const storage = new Storage();
storage.getAvatar('jake').then(…);

// 箭头函数
const foo = async () => {};

```
### `async`返回值
* `async`返回的是一个`Promise`对象，使用`.then`就可以继续进行下一步操作
* `await`进行异步声明的返回`Promise`，`状态`的决定，有以下几种情况：   

   ①：返回以下三种值：`new Error()` 、 `代码块中有Javascript代码执行错误` 、 `Promise.reject()`，则`await`返回的`Promise`对象的状态为`rejected`
   
   ②：若是返回其他值，则返回的`Promise`对象状态则为`resolved`
   
   ③：无返回值：与返回`undefined`情况相同，都返回一个`resolve`状态的`Promise`对象
   
* 返回值的处理：`async`声明的函数，必须等到内部所有的`await`声明返回的`Promise`都执行完了(`reject`或者`resolve`)才能够发生状态变化。（有些类似于Promise.all的规则）

### `await`返回值
1️⃣ 理论上`await`的后面能够跟任何一种表达式的值
2️⃣  但是，我们使用`await`肯定是去做异步操作的，所有`await` 后面大多数情况下，会跟一个`Promise`对象，并且当后面的返回值是`Promise`对象的时候，`会阻塞当前代码的执行`
3️⃣`await`后面若是跟着一个`非Promise`对象，则会当成返回了一个`状态已定的`的`Promise`，多数情况下是`resolved`，除非表达式返回了`Error`
4️⃣ 加入await后跟着的不是标准的Promise对象，但是一个`thenable`对象，那么await也会当做Promise来处理(duck type🦆原则)

### 异常处理
   ```js
   let outter;
   async function f() {
    await Promise.reject('error');  // 或者这里 抛出了任何Error
    outter = await 1; // 后面的diamante都不会继续执行
   }
   f().then(v => console.log(outter));
   ```
* Q1：在`async`函数中可能会进行一个或者多个的`await`异步操作，这些异步操作都是有可能出错的。一旦出错也会影响到主线程的运行   

   A1：我们需要在所有的`await`操作外层包裹一个 `try` - `catch` 语句模块中，并且进行合理的异常处理

* Q2：疑问：为何不在`async`外部统一返回的时候，统一使用`catch`去进行异常的处理呢？

### await继发关系
若在`async`中存在多个`await`的异步任务，但是前结果并不相互依赖，那么最好不要让他们成为继发关系，这样可以提供异步操作的并发率。

```js
async function getAllFile(){
   // 文件A和文件B并不相互依赖
  let foo = await readingFileA();
  let bar = await readingFileB();
  return {
    foo,bar
  }
}
```
如上面代码，这样洗会先进行文件A的获取，完成之后再进行文件B的获取，这样相当于就是一个阻塞的关系了。
建议改为
```js
async function getAllFile(){
  //  直接先生成俩Promise对象
  let APromise = readingFileA();
  let BPromise = readingFileB();
  let  fileA = await APromise;
  let fileB = await  BPromise;
   // 是不是觉得 这里的 await就是相当于以前promise的then和rejct的结合呢，相当于取出value
   // 所以说async/await就是 promise 和 generator的结合呢。
}
```




### 综合理解

  ```js
   async function testSometing() {
      console.log("===9===");
      return "===8===";
    }
   async function testAsync() {
      console.log("===1===");
      return Promise.resolve("===2===");
    }
   async function main() {
      console.log("===3===");
      const testFn1 = await testSometing();
      console.log(testFn1);
      const testFn2 = await testAsync();
      console.log(testFn2);
      console.log('===4===');
    }
   main();
   let promiseFn = new Promise((resolve)=> { 
         console.log("===5===");
         resolve("===6===");
     });
   promiseFn.then((val)=> console.log(val));

   console.log("===7===")
   ```

#### 执行结果

① '===3==='    
> // 执行主线程代码  

② '===9==='   
> // 执行异步await代码的同步代码部分     将一个未知状态的 Promise 放到的异步队列中

③ '===5==='   
> // 执行异步Promise代码的同步代码部分，固定了Promise的状态为resolve,   将一个 then 部分代码放到了 异步队列中

④ '===7==='  
> // 执行主线程的 js代码

⑤ 无输出           
> // 执行了 return "===8===";  相对于resolve了第一个Promise ,将  const testFn1 = await testSometing(); 后面的代码放入异步队列的尾部等待执行

⑥ '===6==='  
> //   执行了  ③ 中的then代码

⑦ '===8===' 
> 顺序执行异步队列

⑧'===1==='  
> // testFn2 执行同步代码 

⑨ '===2==='  
> // 返回的Promise.then仍是微任务，先于下一句执行

'===4==='   
> // testFn2 的带的内容已经返回，阻塞解除继续执行后面的 输出 4

