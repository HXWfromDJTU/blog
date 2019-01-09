##### Tcp的可靠性？
1️⃣ checksum
每个信息包都包含一个校验码，这个校验码头就是一个用来保证信息包在传输过程中没有被更改的代码，当信息到达目的地的时候，接收方会对比较验码和收到的信息中的数据，如果校验码不对，则被信息包将被省略。(校验码机制)
2️⃣ ack验证重传
TCP会要求接收方每收到一个信息包都反馈一下，如果接收方没有提供反馈，发送方会自动重发一次，一直到接收方收到为止(反馈机制)
3️⃣ 序列号保证不乱
TCP每传送一个信息包都会传送一个序号，接收方会检查这个序号，确保收到该信息包，并把全部信息包按顺序重新合并，同时，如果接收方看到一个已接收了的序号，则这个信息包就会被丢弃。(重复性序号机制)
⭕️ 理解记忆

##### Node.js 优势
1️⃣ node是单线程异步非阻塞,可以接受高并发的场景
2️⃣ 不存在线程切换问题
3️⃣ 使用cluster模块进行多线程
⭕️ 手写主从模式代码 



##### c++和js区别 
node分层
底层的C/C++实现了V8+ libuv线程调度  http_parse等工作 
中间架设了桥阶层  
对外的都是node_build module的JavaScript接口
我们的开发基本都是基于内建模块的使用  
⭕️ 理解记忆  


##### 手写js继承实现 与 new
```js
// new 操作
let New = function(fun){
    // 使用闭包更性感
    return function(){
      let o = new Object(); // 新建一个空对象  
      Object.setPrototypeOf(o,fun.prototype); // 绑定原型链   
      fun.call(o,arguments); // 执行构造函数  
      return o;
    }
}
// 模拟继承操作
let Father = function(){
    this.role = 'Father'
}
let Son = function(){
    this.role = 'Son';
}
// 子类构造器的原型，指向父类构造器的实例。
Son.prtototype  =  Father.prototype; // 继承原型上的所有属性(诶，注意，这里包括构造器都继承了，所以下一步需要重写) 
Son.prototype.constructor = Son;  // 修改拷贝过来的原型上的构造器
```
##### 闭包，闭包数据缓存手写 (没写出来）
```js
let calculate = function(a,b){
    console.log('实际执行了计算')
    return a+b;
}
// 闭包实现缓存其实就是使用代理模式，实现一个代理缓存
let proxy_cache = function(){
    let _cache = {}; // 代理缓存器
    return function(){
      // 获取参数 （注意：这里必须要将参数转换为字符串，这样才能作为一个灵活的key）
      let param = Array.prototype.join.call(arguments,',');
      let hasCached = (_cache[param] !== undefined);
      if(hasCached){
        console.log('从缓存中读取......')
        return _cache[param];
      }else{
          let result = calculate(...arguments);
          // 缓存结果到缓存器中  
          _cache[param] = result;
          // 返回计算后的值
          return result;
      }
    }
}
```
##### 事件循环机制 
宏任务、微任务，主进程 
messageChannel Promise 

##### url->页面生成过程  

##### 性能优化  


##### es6新东西  

##### promise执行，事件循环机制

##### http请求方式，最好了解常用的四个以外其他的那几个 

##### http缓存

##### webpack  

##### 模块化规范，CMD原理是什么？（凉凉）

##### vue响应式原理 


技术终面
1. css-module
2. Node怎么捕获错误
3. 自动解决语法规范
4. div 实现三角形
5. primose原理+源码
6. Instanceof原理
7. react16新特性
8. aync + await
9. webpack加载顺序
10. web-view 兼容性
11. wpvue框架
12. proxy
13. 。。。 




、介绍一下自己
2、怎么实现继承，写了用那个实例继承的方式，但是被面试官说这个会存在继承污染还是什么，换另外的方式来做，就用了Object.create()实现继承
3、闭包讲一下
4、js的事件模型是什么样的具体讲一下，有什么作用，在什么场景下会使用到。
5、e.target和e.currentTerget有什么区别（没回答上来）：其实就是e.target指向触发事件的那个元素。e.currentTarget同未修改指向的this指向一致，指向绑定事件的那个元素
6、因为项目当中使用了react-router，就被问了你知道怎么使用js实现路由功能吗（不知道，没回答上来）
7、实现一个斐波那契数列实现输入第n项输出相应的值，优化这个函数，让被查找过的下标值下次再次访问的时候能够立马找到并输出
8、用数组的reduce方法实现数组拍平算法 

1、介绍项目，根据项目提问
2、三栏布局
3、JS原型链
4、Redux库数据流向
5、介绍一下JS中的this，怎么改变this的指向，bind改变this指向的原理
6、let 和 const
7、异步事件执行机制
8、闭包及其应用场景
9、事件处理机制、事件委托的应用场景
10、一个函数new一下和直接调用的区别

现场面试：1、网页渲染过程
2、渲染的每一个阶段的优化方式及原因
3、手撕代码：实现ES6中的promise
4、手撕代码：实现ES6中的Generator
5、进程和线程
6、chrome是多进程还是多线程 ？这样设计的好处？
7、前端缓存技术
8、HTTP状态码