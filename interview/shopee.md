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
DNS服务器寻找ip  一般DNS服务器在ISP处 缓存有常用网址的ip   根域名代理 -> 顶级域名代理 -> 次级域名代理 
http -> tcp -> ip -> mac -> 物理层 
浏览器接收到服务器返回的字符串，然后按照html编码格式进行解析，
若遇到css标签则会开启一个线程进行异步下载，下载完并解析完成后，会得到CSSOM TREE 和 DOM TREE，合起来就是我们熟知的Render Tree，然后就开始正式地渲染页面。
渲染页面过程中若有Javascript标签下载或者遇到内嵌的Javascript代码，则会阻塞渲染线程，优先执行Javascript代码。  


##### 性能优化  
CSS优化  
代码结构性   
首屏优化代码   
工程自动化优化   
拓展运算符   



##### es6新东西  
promise ⭕️ 手写Promise实现原理 
async 
generator  + iterator  ⭕️ 手写 generator实现原理 
set和map  
Symbol   
class 声明与继承  ⭕️ 手写 ES5 实现new 和 继承 


##### promise执行，事件循环机制
宏任务 
postMessage > setTimeOut
微任务
process.nextTick  


##### http请求方式，最好了解常用的四个以外其他的那几个 
GET POST HEAD(类似于get请求，但是没有数据体) TRACE(用于检测网络) PUT(修改资源) DELETE(删除资源) OPTION(请求模拟，比如跨域的试探请求) CONNECT(隧道链接)
##### http缓存
https://juejin.im/entry/57fb373ad203090068c67883
强缓存 协商缓存  

##### webpack  



##### 模块化规范，CMD原理是什么？（凉凉）
CommonJS的模块化(exports、module.exports)  AMD规范(require.js) CMD规范(sea.js)  ES6 模块化(import、export、export default)  

##### vue响应式原理 
从 new Vue() 构造函数开始，里面启动了 _init()方法参数为vue实例的配置项option  
init方法中，记录了当前vue实例的id，初始化了生命周期
initData中 标记了当前vue实例的id,合并了option,初始化生命周期，初始化事件监听容器，初始化渲染，调用'beforeCreate'生命周期钩子，初始化state() ，这里实现了data的数据绑定，也就是 1️⃣ 给数据都设置了_ob_属性 2️⃣ 使用 Object.defineProperty() 在数据 get与set 函数处 设置依赖收集 的拦截  
而后就继续调用‘created’的周期钩子。
最后调用挂载方法，先读取template中涉及到的data数据，触发前面埋下的依赖收集，进而触发renderFun而渲染页面，再挂载在指定的DOM节点上。   

细化来说，initState中会先init prop然后是 methods，然后再初始化主要的 data数据，而后再初始化 computed内容和 watch内容。     

数据的初始化是由 initData来实现的，会先判断传入的data是否为工厂模式，而后遍历内部元素，判断是否与prop有重名，若有则报错。符合条件的数据，会被从vm.data.xxx代理到 vm.xxx，这就是为什么平时我们访问数据只要this.xxx的原因了。data初始化的最后，我们会调用observe函数给数据赋予一个_ob_属性，值是一个观察者对象。   

这个观察者对象是与一个值绑定在一起的，用于监控一个值的变化。Obasever类的构造函数中，会先判断当前值是不是数组，若是数组，则先通过修改数组原型链上的常用几个操作的方法，进行数组元素操作变化的监听，然后会调用observeArray，给数组中的每一个元素都重新进行observe()操作
直到当前元素不是数组了，则直接会对这个数据进行walk()处理

walk（）方法会对当前值得每一个属性都进行 defineReactive操作，也就是我们熟知的给元素绑定get/set埋点方法的操作。 

definedReactive，会为当前数据先设定一个Dep对象，用于收集这个数据会影响哪些操作(操作通常是某个vue组件的renderFun,也可能是某个数据的watch回调) 。
然后在get函数中，先执行原getter内容，然后再用当前值对应的 Dep对象收集依赖。   
在set拦击函数中，也先保留原来的赋值操作，然后再是通知dep对象更新当前值得所有依赖。    

数据的双向绑定的埋点工作已经完成，然后重新回到开始的 init方法，在create周期钩子之后。我们进行了实例的挂载。    

当进行数据挂载的时候初始化生成了一个watcher对象，从而手动触动了watcher内部的get方法，进而调用了传入的渲染操作getter，触动到了template中使用到的data，便将这些量收集了起来。   

待到下次该数据值发生改变的时候，便会触动数据对应的dep对象进行依赖的遍历操作，每一个依赖都会执行update方法，就形成了dom的更新。 





技术终面
1. css-module
2. Node怎么捕获错误
3. 自动解决语法规范
4. div 实现三角形
##### primose原理+源码  
##### Instanceof原理
例如a instanceof B , 查找原理是 在对象a到的原型链上进行查找，若运算符的右边的对象b的prototype属性，在a的原型链上。则返回true，否则返回false。
⭕️ 手工绘制原型链、作用域链条、栈和堆的调用关系   
7. react16新特性
8. aync + await
9. webpack加载顺序
10. web-view 兼容性
11. wpvue框架
12. proxy
13. 。。。 


2、怎么实现继承，写了用那个实例继承的方式，但是被面试官说这个会存在继承污染还是什么，换另外的方式来做，就用了Object.create()实现继承  
```js
function Father(){};
function Son(){};
Son.prototype = Father.prototype;
Son.prototype.consturctor = Son;
```
##### 闭包讲一下 

##### js的事件模型是什么样的具体讲一下，有什么作用，在什么场景下会使用到。

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

现场面试：
1、网页渲染过程
2、渲染的每一个阶段的优化方式及原因
3、手撕代码：实现ES6中的promise
4、手撕代码：实现ES6中的Generator
5、进程和线程
6、chrome是多进程还是多线程 ？这样设计的好处？
7、前端缓存技术
8、HTTP状态码