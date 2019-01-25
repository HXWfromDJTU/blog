#### Tcp的可靠性？
1️⃣ checksum
每个信息包都包含一个校验码，这个校验码头就是一个用来保证信息包在传输过程中没有被更改的代码，当信息到达目的地的时候，接收方会对比较验码和收到的信息中的数据，如果校验码不对，则被信息包将被省略。(校验码机制)
2️⃣ ack验证重传
TCP会要求接收方每收到一个信息包都反馈一下，如果接收方没有提供反馈，发送方会自动重发一次，一直到接收方收到为止(反馈机制)
3️⃣ 序列号保证不乱
TCP每传送一个信息包都会传送一个序号，接收方会检查这个序号，确保收到该信息包，并把全部信息包按顺序重新合并，同时，如果接收方看到一个已接收了的序号，则这个信息包就会被丢弃。(重复性序号机制)
⭕️ 理解记忆

#### Node.js 优势
1️⃣ node是单线程异步非阻塞,可以接受高并发的场景
2️⃣ 不存在线程切换问题
3️⃣ 使用cluster模块进行多线程
⭕️ 手写主从模式代码 



#### c++和js区别 
node分层
底层的C/C++实现了V8+ libuv线程调度  http_parse等工作 
中间架设了桥阶层  
对外的都是node_build module的JavaScript接口
我们的开发基本都是基于内建模块的使用  
⭕️ 理解记忆  


#### 手写js继承实现 与 new
```js
// new 操作
let New = function(fun){
    // 使用闭包更性感
    return function(){
      let o = new Object(); // 新建一个空对象  
      Object.setPrototypeOf(o,fun.prototype); // 绑定原型方法   
      fun.call(o,arguments); // 绑定原型属性     
      return o; // 返回改造后的对象   
    }
}
// 模拟继承操作
// 声明父类的构造器
let Father = function(){
    this.role = 'Father'
}
// 声明子类的构造器
let Son = function(){
    this.role = 'Son';
}
function inherit(subType,superType){
    var prototype = Object.create(superType.prototype);
    prototype.constructor = subType;
    supType.prototype = prototypr;
}
// 若是不支持 Object.create 则使用兼容方法 
function object(o){
   fucntion F(){}; // 声明一个空的构造器 
   F.prototype = o; // 连接构造器与构造原型  
   return  new F();   // 返回一个空构造器的实例（目的就是拷贝了一份o）
}


```
#### 闭包，闭包数据缓存手写 (没写出来）
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
#### 事件循环机制 
宏任务、微任务，主进程 
messageChannel Promise 

#### url->页面生成过程  
DNS服务器寻找ip  一般DNS服务器在ISP处 缓存有常用网址的ip   根域名代理 -> 顶级域名代理 -> 次级域名代理 
http -> tcp -> ip -> mac -> 物理层 
浏览器接收到服务器返回的字符串，然后按照html编码格式进行解析，
若遇到css标签则会开启一个线程进行异步下载，下载完并解析完成后，会得到CSSOM TREE 和 DOM TREE，合起来就是我们熟知的Render Tree，然后就开始正式地渲染页面。
渲染页面过程中若有Javascript标签下载或者遇到内嵌的Javascript代码，则会阻塞渲染线程，优先执行Javascript代码。  


#### 性能优化  
CSS优化  
代码结构性   
首屏优化代码   
工程自动化优化   
 



#### es6新东西  
promise ⭕️ 手写Promise实现原理 
async 
generator  + iterator  ⭕️ 手写 generator实现原理 
set和map  
Symbol   
class 声明与继承  ⭕️ 手写 ES5 实现new 和 继承 


#### promise执行，事件循环机制
宏任务 
setTimmediate >postMessage > setTimeOut 
微任务
process.nextTick mutationObserver  

执行顺序是，先执行主代码，过程中遇到的宏任务和微任务分别放置到各自的任务队列中，主代代码执行完毕之后，微任务队列的所有异步任务都清出执行，过程中有遇到微任务的立即添加到当前任务的队尾，也按照顺序马上执行。  若遇到宏任务，则直接放到宏任务队尾。  

清空微任务对列之后，从宏任务对列取出一个宏任务执行，然后过程中若遇到宏任务，先放到队尾，但不马上执行。遇到微任务，则放到微任务队列。宏任务回调的主代码执行完后，马上清空当前的微任务队列所有任务。      



#### http请求方式，最好了解常用的四个以外其他的那几个 
GET POST HEAD(类似于get请求，但是没有数据体) TRACE(用于检测网络) PUT(修改资源) DELETE(删除资源) OPTION(请求模拟，比如跨域的试探请求) CONNECT(隧道链接)
#### http缓存
https://juejin.im/entry/57fb373ad203090068c67883
强缓存 协商缓存  

#### webpack  



#### 模块化规范，CMD原理是什么？（凉凉）
CommonJS的模块化(exports、module.exports)  AMD规范(require.js) CMD规范(sea.js)  ES6 模块化(import、export、export default)  

#### vue响应式原理 
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
##### Node怎么捕获错误  
[【node系列 1-7】小议node异常处理](/node/error_handler.md)  

3. 自动解决语法规范
4. div 实现三角形

#### primose原理+源码  
📒 [手工实现一个promise](/algorithm/promise.js)   

#### Instanceof原理
例如a instanceof B , 查找原理是 在对象a到的原型链上进行查找，若运算符的右边的对象b的prototype属性，在a的原型链上。则返回true，否则返回false。
⭕️ 手工绘制原型链、作用域链条、栈和堆的调用关系   
⭕️ 手写instanceof的实现  

7. react16新特性   


##### aync + await  
async/await 是ES7的新规范，是一个异步解决的新方案。但另一方面我们也可以仅仅把他看做是综合了Promise规范和一个带自动执行器的generator规范。      
async 关键字声明了一个异步函数，函数内部可以包括多个用await声明的异步操作。

await 一定要声明在async方法中，await的作用和原来generator的yiled含义基本相同，yield是啥意思？放弃，退让的意思，程序执行到这里，就会把代码指定的主动权让出来。   
await后面所跟着的表达式，规范中该规定会返回一个Promise对象。若后面跟着的不是一个promise对象，是一个其他值，则默认返回一个转台为resolved的promise对象，若表达式执行过程中执行错误，则返回一个rejected的promise对象。    
就日常开发而已，我认为单个的异步任务，使用async/await优势并不明显，而是在多个异步任务，并且后一个任务的请求条件要以前一个/或多个为基础的情况下，async/await就可以解决多重嵌套的问题，以同步的代码形式实现了异步前后依赖的功能。   
<span class="err">值得一提的是,await使用的时候，若多个任务之间没有依赖，则要将多个异步任务同时执行掉，再用await去等待返回值，否则会出现浪费时间的问题
```js
async function(){
  let pro1 = getValue1Async();
  let pro2 = getValue2Async();
  let result1 = await pro1;
  let result2 = await pro2;
}
   // 是不是觉得 这里的 await就是相当于以前promise的then和rejct的结合呢，相当于取出value
   // 所以说async/await就是 promise 和 generator的结合呢。

```

</span>
⭕️ 需要练习一些async的练习题  

#####  webpack加载顺序   
loader的加载顺序是自由向左的。  

工作流程
① webpack会使用 bin/webpack.js 进行命令行中 阐述的解析，初步读取参数。  
② webpack会使用 lib/webpack.js 生成一个compiler实例，继承一个叫做 产检管理工具类，使用其apply方法记载各种内置的和外置的插件。 

③ 程序中有一个 process 的函数，读取用户的webpack.config.js配置，使用上一步加载出来的插件，对文件进行处理  

④ 程序输出整合出指定的文件   



10. web-view 兼容性
11. wpvue框架
12. proxy
13. 。。。 


#### 怎么实现继承，写了用那个实例继承的方式，但是被面试官说这个会存在继承污染还是什么，换另外的方式来做，就用了Object.create()实现继承  
```js
function Father(){};
function Son(){};
Son.prototype = Father.prototype;
Son.prototype.consturctor = Son;
```
面试被问到的时候，顺便提起`HAS-A`和`IS-A`的问题。  
⭕️ 另外了解一下什么是继承污染，如何解决？ 

#### 闭包讲一下 
定义：闭包就是能够读取其他函数内部变量的函数。比如说我们在一个函数内定义另一个函数，这个内部函数就可以访问外层函数的变量，当我们将内部函数的句柄返回给外部调用者时，外层函数中被内部函数调用的变量则不会被释放掉。  
作用    
1️⃣ 用对面向对象编程，类似于 function+prototype的模式，但是调用方法的时候不需要每次都去查找原型链   
2️⃣ DOM循环绑定事件       
3️⃣ 延长某些不想要释放的变量的寿命，比如说一个使用image对象进行数据上报(异步操作)，若不适用闭包，则创建的image对象，在请求发送之后就会被释放掉     
4️⃣ 在设计模式中的应用，比如使用 代理模式 实现一个计算缓存代理。     
5️⃣ 对函数的一些修饰或者修改其行为，比如防抖与节流的操作。 

建议延伸到作用域和作用域链的问题。   




#### js的事件模型是什么样的具体讲一下，有什么作用，在什么场景下会使用到。
 
📒 [DOM事件模型](/JS/eventMode.md)


#### e.target和e.currentTerget有什么区别（没回答上来）
其实就是e.target指向触发事件的那个元素。e.currentTarget同未修改指向的this指向一致，指向绑定事件的那个元素
[DOM事件模型](/JS/eventBubble.md)

#### 因为项目当中使用了react-router，就被问了你知道怎么使用js实现路由功能吗（不知道，没回答上来）
⭕️ 手绘 vue-router 解析图   
♎️ 写一篇vue-router的源码解析，理解   

#### 实现一个斐波那契数列实现输入第n项输出相应的值，优化这个函数，让被查找过的下标值下次再次访问的时候能够立马找到并输出

#### 用数组的reduce方法实现数组拍平算法 
```js
/**
 *  flatten
 */
function flatten(arr){
  let arr =array;
  let len = arr.length;
  for(let i=0;i<len;i++){
    return arr.reduce((prev,next)=>{
      return prev.concat(Array.isArray(next)?flatten(next):[next])
    })
  }
}
```



1、介绍项目，根据项目提问
#### 三栏布局   
#### JS原型链  

4、Redux库数据流向
##### 介绍一下JS中的this，怎么改变this的指向，bind改变this指向的原理  
this 的指向定义上来说是指向当前的执行环境，若放到函数中来说呢，一般是谁调用它那就指向谁。  
改变this的指向可以是用 apply call还有 bind方法。      
三者改变this指向的原理都差不多，给传入的this绑定一个临时属性，值为调用的函数，那么执行的时候，因为原函数的调用者改成了新的this(或者说context)，那么原函数中的this，的指向就指向了新的调用环境。   

给面试官写一下apply的实现原理，用eval

##### let 和 const  
let 表示在当前作用域下声明一个变量，并且不会像var 那样出现变量提升，所以会存在严格的TDZ。<span class="err">并且let不允许重复声明</span>
const 声明的是一个常量，也不存在变量提升，但必须声明时就赋值。并且赋值之后不可以再修改，否则报错。   
在很多的情况中，我们旧项目中的var都可以用let去进一步规范化     





##### 异步事件执行机制  
直接聊一聊事件环  


##### 闭包及其应用场景   



##### 事件处理机制、事件委托的应用场景
事件处理机制有两种，分别是IE团队先提出的“冒泡模式”，还有一种就是网景团队优先提出的“事件捕获”。我们现代的浏览器都是全支持的。比如说一个DOM事件的发生，都是先发生事件捕获，然后再发生事件冒泡。   

在我们常用的 addEventListener方法中，第一个参数是事件名，第二个是回调函数，第三个参数表示是否要在事件“捕获阶段”来获取事件，默认为false。若改为true，则事件会在捕获阶段来触发。    
这里面有一个target和currentTarget的区别，currentTarget表示事件被绑定在哪一个元素上，而target呢表示事件真正触发的源头。  

最后我们引申出事件委托，比如说在一个ul-li列表中，我们在列表上的每一个项目都想要点击跳转，发送不同的请求。一般的思路呢就是给所有的li都绑定上事件，然后点击触发。当时列表元素特别多的时候，过多的事件监听器就会造成内存的浪费。   

这时候我们在ul元素上监听事件，然后在时间内部获取事件触发的源头`target`的信息就可以知道用户点击了那个元素，形成和上一种做法一样的效果。   

这里我们还要注意，不同浏览器对事件对象的兼容不一样，我们获取事件源，兼容性的做法是
<span class="fixed">
```js
let event = event || window.event;
let target = event.target || event.srcElement;
```

补充：若是li列表中的内容含有多种不同元素，target不确定怎么办？
那就在获取target后进行判断，若不是想要的元素，就继续循环获取父节点（因为内容只有一个“根”，那就是li节点）

</span>
##### 一个函数new一下和直接调用的区别
new操作的话相当于把当前的函数，当做一个类的构造器，（此时可以手写new过程给面试官），第一步创建一个空对象，再将其原型 “_ _proto_ _” 对象指向对象的prototype。最后再借用这个构造器，将内部this指向新创建的对象。   


若是直接执行的话，就相当于创建了一个临时的作用域，然后在内部执行一些代码。执行完之后。内部的量也被释放掉，不再可以被访问。若要延续内部的一些量，的生命周期，那么就要使用到闭包这个东西了。比如上面new代码中的新创建对象，就被返回到外面，从而被保留了下来。   




#### 渲染的每一个阶段的优化方式及原因  
先介绍浏览器的工作模式，进程与线程的角度去说明。 

网络请求部分 
`DNS优化`  
使用DNS pre-fetch，大面积使用在导航页以下的二级页面，当用户加载完首屏导航之后，就会利用空余时间提前进行二级页面的DNS查询。

``
使用打包工具进行资源整合与压缩，减少资源的请求数目，也减少的资源的大小。

图片使用雪碧图片，图标使用icon-font，大大减少了网络请求的次数。

首屏渲染可以提取关键css，使用内嵌模式加入，剩余的css使用外部引用加入。这样可以减少首屏的渲染事件，并不需要等待CSS资源的RTT时间。      

尽量使用CDN托管，使得静态资源加载速度更快。 

script标签尽量放在DOM的底部，这样不会阻碍Render Tree的生成。  

http缓存
<div class="fixed">
静态资源分片，因为浏览器对同一个域名下的请求TCP数目是有限制的，一般为6~8个。但是我们现代的网站资源数目及其繁杂，建议将不同资源分配到不同的主机上，那么访问资源的速度就能够加快。

使用更高级更先进的通信协议，比如http2.0和quic等等


</div>

`架构层面`  
首屏直出渲染，使得首屏的数据不再受到ajax请求的影响。   

从业务代码上，减少数据的请求次数（比如说要获得一个模块的数据，需要多个细粒度接口的请求，减量避免分开请求，可以架设中间层进行接口的组装和数据的拼装）   

`减少渲染阻塞`  
CSS的外部引入一定要在DOM节点的顶部，因为可以尽早的下载  
在页面中DOM节点特别多的时候，在选择器上就要下功夫，尽量不使用范围性的选择器，也避免使用子类、兄弟类选择器，建议定义标准的CSS命名规范来达到这个效果。BEM等等。

JS引入沉底

若不是关键的Javascript，可以使用 `async` `deffer`形式进行引入，这样就不会阻塞解析。   

`DOM优化`

图片使用懒加载模式进行挂载与渲染  
 

<span class="fixed">

`编码层面`

`CSS`
首屏建议使用key-css   


`JS` 
使用javascript修改样式的时候，尽量只通过修改DOM的class来改变样式，而不是直接修改style。  
对DOM的访问记得要进行缓存，切忌在循环中重复访问DOM节点。   
定时器使用完之后一定要进行销毁   
对一些高频触发的监听记得要进行防抖和节流

</span>

[参考文章](https://segmentfault.com/a/1190000016458627)


#### 手撕代码：实现ES6中的promise  
📒 [手工实现一个promise](/algorithm/promise.js)

##### 手撕代码：实现ES6中的Generator  


#### 进程和线程  
目前工作中接触到的进程和线程，分为两个环境去说，一个是浏览器环境，一个是node环境。   
先说说。
一般的现代浏览器都是采用的是多进程模式，这里说的进程还分为几种，浏览器主进程、插件管理,GPU管理进程，还有一种是浏览器渲染进程。其他的进程基本都是共享的，浏览器渲染进程，一个web页面(标签页)，每个标签页都是一个单独的web程序，都有一有一个。
就像是后端常见的主从模式一样，主进程负责接收请求、调度各个工作进程，然后还有一些GPU进程和插件进程，充当协助进程的作用，分担一些子进程（渲染进程）的工作。

工作最频繁的渲染进程进程中，工作的时候，又会去创建`GUI渲染线程`、`JS执行线程`、`定时器线程`，<span class="tips">异步请求http线程</span>等。  

其中渲染线程和JS执行线程是互斥的。 

GUI渲染线程主要负责DOM的解析，CSS的解析，页面的重排与重绘，调用的是浏览器的渲染内核。

JS执行线程调用的则是 js执行内核 类似于 V8 Chakara monkey    

定时器线程 与 事件触发线程，这两个线程都是可以理解为 是为 JS执行线程服务的协助线程。分别帮助JS执行线程管理定时器和管理来自与异步的一些操作，比如说用户的点击事件等。      


再说收一个请求过来，我们的主进程向远端发起请求，请请求到了页面内容，然后将内容通过进程间的通信接口，发送给对应页面的渲染进程，渲染进程收到资源后，调用GUI渲染线程进行字符串解析，生成DOM树，CSS 规则树，合并成为Render Tree，然后把结果发还给主进程，主进程调用GPU渲染进程进行页面渲染。      

可以引导面试官，聊一聊自己的人员轨迹项目....排序分组和DOM渲染的问题。Canvas渲染的问题。   


而要另外聊聊 node 的线程和进程的话，我了解这方面的内容是从node

#### chrome是多进程还是多线程 ？这样设计的好处？
回答如上题目。
好处是每一个tab页面都是有一个单独的内核进程来管理，页面之间的运行不会相互影响，插件管理进程服务于多个页面，GPU渲染进程也是共享于多个页面。类似于主从模式下的管理，节省进程的数目，每个进程都有自己明确的工作。         

#### 前端缓存技术  
前端缓存，放到打一个层面来说我们称之为 前端的持久化。  
持久化的方法一般有 cookie/webstorage（local\session）还有常用的http缓存  
cookie 一般来说比较小，一个客户端对应所有的域名存储的信息大小不能够超过4k,而且每次请求的时候都必须要携带，存在浪费带宽的情况。而且多次携带者用户的敏感数据，来回跑，也是十分之不安全和没有必要的。  <span class="tips">每个域名都有限制数目，一般在50个左右</span> 

然后是我们H5新增的webstorage，分为local和session两种，两者的容量都在5M左右，也和cookie一样都存在着，一个域名对应一个key-value池，跨域名不可以访问和修改。

生命周期来说，sessionStorage在用户关闭浏览器之后（或者tab页面）就会消失，而localStorage不是用户主动地去清理，一般不会消失。       

值得一提的是浏览器的隐私模式，在Safari和Chrome中，sessStroage的功能并没有收到影响，而localStorage在关闭浏览器之后呢重新打开，则所有的key都被清除了。  
在firefox浏览器中，无痕模式下的这两个api都直接被禁用了。也就是set值都无法正常操作。



然后是http的缓存机制  
常见的http报文头 
cache-control这是强缓存，可以设置expire,max-age，no-cache,no-stargae等等来控制  

当开启了缓存协议，那么浏浏览器发起资源请求前，都会先执行强缓存策略，若未能命中，则改为使用协商缓存  

协商缓存常用的有两个标志头组
last-modified 和 if-modified-since   
e-tag 和 if-match     

两组报文对各有优势，http1.1的e-tag技术更加精准，但是也会稍微消耗一些资源。    



#### HTTP状态码

1XX 的是表示请求正在处理中或者请请求升级  
2XX 表示的是请求已成功，服务器会按照请求的类型不同而返回不同的内容。   
3XX 表示重定向，但有一个304表示命中缓存  
4XX 表示客户端错误
5XX 表示服务端错误  

常用的来说  
100 表示请求已经被接受了，服务器正在处理中，希望客户端继续发送数据已完成请求  
101 表示协议升级，或者说是协议切换。比如说我们首次请求的时候使用的是，http，服务端则会返回一个101响应，表示switching protocol告诉客户端升级到https，又或者本次通信准备使用websocket协议进行，那么客户端收到101状态码后，读取报文中的<span class="tips">Upgrade字段</span>中的，建议升级到的协议，然后下一次通信就开始使用切换后的协议。   

200 使我们最常见的请求成功报文。使用HEAD请求的时候不会返回实体。
204 表示请求成功但是没有没有实体内容返回，与HEAD不同点在于，若是浏览器使用该地址作为导航，返回200会跳转页面，而返回204状态码则不会跳转。

206 出现在对于资源的部分请求，常见于大文件的分段下载。客户端一般会根据服务端首次返回的报文中，寻找是否有 Range-Request这个字段，表示这个资源是否支持分段下载，若支持，则客户端会开始进行范围请求。
客户端首先在报文头中，携带<b class="err">range</b>字段，表示请求的范围。  
服务端返回的报文中，必须指出<span class="err">content-range</span>字段，表示次请求返回的实体内容的区间。   

301 表示永久重定向，包括我们的书签也会被修改<b class="tips">深挖</b><b class="err">伴随着报文的Location字段会返回重定向后的地址</b> 

302、303、307 都表示的是临时重定向，浏览器保存的书签任然还是指向原页面，其中302是HTTP1.0就有的产物，而HTTP1.1才出现303和307。  
被302重定向之后，浏览器处理为不改变请求方式，直接重新发起请求。 
三种返回状态，在GET请求的时候基本没什么不一样，浏览器都会处理为直接使用`GET`方法重新发送请求。

而因为POST请求不是幂等的，重新POST(比如说重新发送表单、重新进行支付等等)，都会造成不可预料的结果。三种返回状态就有不同的处理方式。   

<span class="fixed">大多数浏览器都会在POST请求遇到重定向的时候，改为GET请求重新发送</span>


304 表示命中缓存的一个状态码。客户端收到304之后就会直接读取本地缓存的数据。  

4XX 

400 Bad Request 表示客户端的请求报文有问题，服务端不能理解客户端的请求内容。

401 Unauthorized 表示请求的资源需要进行认证 <span class="fixed">表示页面需要认证，或者表示上一次的认证通信失败了<span>

403 Forbiten 表示客户端无权访问该资源
  
404 Not Fount 表示请求的资源不存在
 

5xx  

500 Internal Server Error 表示系统内部发生错误，也有可能是一些系统不想告知外界的一些情况。

503 Service Uavaliable 表示服务暂时不可用，会伴随 Retry-After：<Date> 去表示预计服务恢复的时间  

<span class="fixed">502 Bad Gateway 表示客户端的请球未能通过BGP出口，Border Gateway Protocol，一般是服务机房的网关问题。</span>一般稍等时间，然后使用强制刷新后即可解决。      








<link rel="stylesheet" href="../config/global.css"/>
<style>.tips{color:red;font-size:12px;border:1px solid grey;border-radius:5px;background-color:yellow;position:relative;top:0px;}</style>