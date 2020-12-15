1.请写出你知道http状态码及其含义 
  * 1xx 101 协议升级http 切换到 https，或者 https 切换到 wss 之类的
  * 2xx 表示请求成功
    1. 200 表示数据成功返回
    2. 204 No Content
    3. 206 Partial Request 部分请求
        * If-Match ???
  * 3xx 大部分表示重定向
    1. 301 MOVE Perxxxxx 永久重定向
    2. 302 FOUND 临时重定向，http1.0 非 head/get 请求，需要询问用户后再进行重定向
    3. 303 SEE OTHERS 临时重定向，非 head/get 请求，将直接改为使用 get 进行二次请求请求
    4. 307 TEMPOARily MOVE 临时重定向, http 1.1 同302处理方式
    5. 304 表示命中协商缓存，浏览器使用本地缓存数据即可
  * 4xx 表示客户端错误
    1. 400 Bad Request 一般为请求参数错误
    2. 401 Authorazation Fail 认证失败
    3. 403 鉴权失败，无权访问
    4. 404 找不到资源,或者表示不想透露的原因
    5. 405 Method Not Allow
    6. 416 Requested Range Not Satisfiable
    7. 417 Expectation Failed
  * 5xx 一般表示服务器错误
    1. 500 表示内部服务器错误
    2. 502 Bad Gateway 网关错误，尝试强制刷新页面，不行再找后端负责的同学
    3. 503 服务暂时不可用
    4. 504 Gateway Timeout

2.假如移动端设备的尺寸是640px要实现每1rem=16px怎么实现？ 
  1. flexible.js 
  2. 设置 html 元素 font-size 为 16px


3.请使用css画出三角形 4.请使用css画出梯形 
 ```css
 /* 1. 多变形是使用四边宽度一致，但是三边颜色透明来实现。
    2. 减小宽度来隐藏，会影响显示图形 */
  .retangle {
            width: 20px;
            height: 0;
            border-width: 50px;
            border-color: green;
        }

        .triangle {
            width: 0;
            height: 0;
            border-width: 0 0 100px 0;
            border-color: red;
        }

```


### 写输出1

```js
var a = 3;
function change(a) {
    a = 4;
}
change(a)
console.log(a); // 3


var user = {age:30}

function change2(user) {
    user.age = 40;
}

change2(user);
console.log(user.age); // 40

function change3(user) {
    user = {age:50}
}
change3(user);
console.log(user.age); // 40
```

### 写输出2
```js
function test(a,b){
    console.log(b); 

    return {
        test: function(c,a){
            return test(c,a)
        }
    }
}
var a = test(100,200); // 200
a.test(300); // 100
a.test(400); // 100

function test(a,b){
    console.log(b); 

    return {
        test: function(c,a){
            return test(c,a)
        }
    }
}
var b = test(101).test(201).test(401); // undefined 101 201


function test(a,b){
    console.log(b); 

    return {
        test: function(c,a){
            return test(c,a)
        }
    }
}
var c = test(102).test(202,302); // undefined 302 202 
c.test();
```

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

5. 如何让(a == 1 && a == 2 && a == 3) 的值为true？

```js
values = [1, 2, 3]

Object.defineProperty(window, 'a', {
  get () {
    return values.shift()
  }
})
```
```js
var a = {
    values: [1, 2, 3],
    toString () {
        return this.values.shift()
    }
}
```

6. Vue 生命周期
  1. beforeCreate
  2. created 访问使用 data
  3. beforeMount
  4. mounted 请求数据
  5. beforeUpdate
  6. updated
  7. beforeDestory 移除定时器，事件绑定等
  8. destory

7. 不使用 for 或者 while, 创建一个长度为120的数组，并且每个元素的值等于数组长度减去它的下标   
    1. 得到一个长为 100， 元素为 undefined 的数组
    2. 使用 Array.prototype.keys 获得一个下标的遍历器
    3. 使用 拓展运算符， Array.from 得到数字数组
    
    [...Array(120).keys()].map(num => num + 1).reverse()

8. 如何设置浏览器缓存与不缓存两种。


9. 如何解决跨域问题?
1. jsonp
2. CORS - Assess-Control-Allow-Origin
3. proxy-server nginx node
4. postMessage
5. websocket 直接跨域


简述一下弹性（flex)布局有哪些属性，各属性有什么作用
 * 父元素
   1. display: flex;
   2. justify-content: 主轴内容方向
   3. align-items: 垂轴内容方向
   4. flex-direaction: 用于指定主轴方向
 * 子元素
   1. flex:  flex-grow flex-shrink flex-basis
   2. align-self
   3. order

   * 小技巧: 
     flex布局中，子元素的margin-left 或者 margin-right 为 auto可以在起到将元素撑到尽头的效果。    

flex 实现两栏布局
  div.main {
    display: flex;
    flex-wrap: wrap;
  }
  div.main left {
    flex: 0 0 300px;
  }
  div.main .right {
    flex: 1 0 0;
  }

2. 请用css3画出一个扇形
    * 扇形是在三角形的基础上，添加了圆角属性
    ```css
      .triangle-circle {
        width:0;
        height:0;
        border-color: transparent transparent red transparent; /* 颜色在哪边，就是哪边的扇形 */
        border-style: solid;
        border-width: 100px;
        border-radius: 100px;
      }
    ```
3. 用css定义一个宽高不定，水平垂直居中的弹窗。  
    ```css
      div.
    ```

4. 直接上代码，问alert会弹出些什么。
```js
function test(a, b){
  //debugger 想不通就去单步调试
  console.log(b);
  return {
    test: function(c) {
      return test(c,a);
    }
  }
}

var a = test(100); a.test(101); a.test(102); // undefined 100 100
var b = test(200).test(201).test(202); // undefined 200 201
var c = test(300).test(301);c.test(302); // undefined 300 301
```

5. 看代码写输出
```html
<script>
  var string = 'test';
  document.write('<scr' + 'ipt> console.log(string);arrfam([1]);console.log(num);</' + 'script>')
</script>
<script>
  var num = 456;

  function arrfam(arr) {
    if (arr instanceof Array) {
      console.log('is Array');
    }else{
      console.log('is string');
    }
  }

  arrfam(string);
  arrfam([string]);
</script>
会报 arrfam is not defined 错误
is string
is Array
```

Vue 与 React 的异同点是什么？
 * 相同点
   1. 设计思想都是用单向数据流
   2. 
 * 不同点
   1. 数据更新的时机，可以称之为 push-based 与 pull-based
     * Vue 采用依赖追踪的办法，用户只需要关心数据的变化，模板中的渲染的数据也会跟着变化    
     * React 数据更新之后，需要用户主动通知模板去渲染  
     * 同样的，vue 可以将 data freeze 后，使得数据不再被跟踪，而 React 也可以使用 MobX 这样的工具实现数据的双向绑定。   
   2. 编程风格: 
    * Vue 使用的是 web 开发者更熟悉的模板与特性
    * React 特色在于函数式编程的理念
   3. 上手难易程度
    * 对初学者、后端开发: Vue 只需要根据文档敲基本不出什么大问题。    
    * 对JavaScript比较熟悉的: 基本不需要阅读什么文档，更多的是去理解他的设计思维，然后用原生的JavaScript进行开发
   4. 设计思路
    * Vue 设计的时候认为 UI 和 数据是一个映射、绑定的关系
    * React 本身不提供数据与UI的映射关系，也没有数据绑定，UI的展示只是一个副作用而已。
   5. 定位
    * Vue 是一个 Framework，一个 MVVM 框架，提供了许多的约束，比如template的写法
    * React 更像是一个 library，用更原生API，结合自身的JavaScript编程能力去玩
   6. template vs jsx
    * vue: 为了整体 tempalte 代码的美观，其中包含了多种的语法糖，一时的你需要去记住需要的 api    
    * react: jsx 更多的就是原生的 JavaScript， 看起来虽然不美观，但是也降低了一些理解上的心智压力    

如何进行选型
   1. 更新动力
      1. 仍只是尤大为主的几个个人开发者，为主要贡献者
      2. Facebook 主要进行维护
   2. 生态
      1. vue 的中文生态更好，但是总体的质量不算太高   
      2. react 在全球范围下的社区生态更好   

https://www.zhihu.com/question/301860721/answer/724759264 

6. 要求实现常用的排序算法

7. 以vue或是react为例，画出生命周期图？
  1. before Create 适合添加loading   
  2. created  数据请求放在 created 之后都可以，但为了更快获得结果，一般就统一放在 created 中了。
  3. before Mount 
  4. mounted 获取元素节点信息等   
  5. before update 
  6. updated
  7. before destory 移除事件监听等
  8. destoryed
  9. keep-alive 中出现的 activated 与 deactivated  
  10. nextTick 保证数据已经更新到DOM上    
  * 初次加载仅会触发前四个生命周期函数      
  * 在 updated 中再次进行数据修改，会进入死循环       

8. 如果要你掌握一门后端语言，你会使用那一门？ 为什么？   

9. 请使用ES6实现一个工厂模式。
   * 我们不暴露创建对象的具体逻辑，而是将将逻辑封装在一个函数中，那么这个函数就可以被视为一个工厂
   类似于 Promise.resolve('123') 生成一个 Promise 对象一样, 使用函数构造的形式创建
   ```js
    class SuperAdmin{
       constructor(){
          this.name = "超级管理员";
          this.viewPage = ['首页', '通讯录', '发现页', '应用数据', '权限管理']
        }
     }

     class Admin{
         constructor(){
           this.name = "管理员";
           this.viewPage = ['首页', '通讯录', '发现页', '应用数据', '权限管理']
         }
      }

       class NormalUser{
         constructor(){
           this.name = "普通用户";
           this.viewPage = ['首页', '通讯录', '发现页', '应用数据', '权限管理']
         }
       }

       //工厂方法类
       class UserFactory {
         getFactory(role){
          switch (role) {
            case 'superAdmin':
              return new SuperAdmin();
              break;
            case 'admin':
              return new Admin();
              break;
            case 'user':
              return new NormalUser();
              break;
            default:
              throw new Error('参数错误, 可选参数:superAdmin、admin、user');
          }
         }
        }

       //调用
       let uesr =new UserFactory();
       uesr.getFactory('superAdmin');
       uesr.getFactory('admin');
       uesr.getFactory('user');
   ```

vueRouter history模式与hash模式有什么区别？
   

Proxy解决了什么问题
  1. 在 Vue 中解决了当数据层次过多，数据响应式监听将消耗更多性能     
  2. 在数据拦截后，对象属性的新增、删除操作无法监听到     
  3. 数组的增删操作也进行了拦截，而不是使用现在的拦截方法       

vue data为何要是function
  1. 因为组件可能会被多个地方使用，对创建多个data实例
  2. 若 data 不是一个function，而是 组件原型上的一个对象，那么修改 A 组件则 B组件的数据也会被同时改变      
  3. 当 data 是一个 function 时，每次实例化，执行 data () 函数返回的都是一个新的 数据对象     
  4. 这样就做到了 组件之间的数据隔离     

nextTick
  1. Vue 源码中使用了 Promise、Mutation Observer、MessageChannel 几种手段来模拟微任务
  2. 使用场景是确保当前的 callback 在数据更新到 DOM 上后再执行
  3. nextTick 分为了内部调用 与 外部调用，内部将所有DOM更新的操作都优先塞到呢 nextTick queue 中了

14. 常用的闭包有哪些？
  1. 形成一个封闭的作用域，并且与顶级的关联只有暴露出来引用，便于清理
  2. 面向对象中的单例模式    

盒子模型怎么理解？ 
  1. 正常盒模型: width = content
  2. 怪异盒模型: width = content + padding + border
  3. 使用 box-sizing: content-box 与 border-box 进行调整

15. 写一下双飞翼布局、圣杯布局
    ```html
     <body>
       <div class="container">
          <div class="main box"></div>
          <div class="left box"></div>
          <div class="right box"></div>
       </div>
     </body>
     <style lang="scss">
       .container {
         clear: both;
         padding: 0 100px;

         .box {
            float: left;
         }

         .main {
            width: 100%;
            background: red;
         }
         .leftbox {
            width: 100px;
            margin-left: -100%;
            position: relative;
            left: -100px;
            background: green;
         }
         .rightbox {
            width: 100px;
            margin-left: -100px;
            position: relative;
            right: 100px;
            background: purple;
         }
       }
     </style>
    ```
    ```html
      <body>
        <div class="container">
          <div class="main-box"></div>
        </div>
  <div class="left-box"></div>
  <div class="right-box"></div>
</body>
     <style lang="scss">
     .container {
  width: 100%;
  
  .main-box {
    margin: 0 100px;
    backcground: red;
  }
}

.fl {
  float: left;
}

.left-box {
  width: 100px;
  backcground: green;
  margin-left: -100%;
}

.right-box {
  width: 100px;
  backcground: purple;
  margin-left: -100px;
}
     </style>
    ```
  * 两种布局的唯一差别，只是在于 1. 两翼是否飘于容器外  2. 两翼的偏移方式是否需要 relative 二次微调

16. React 与 Vue 的区别是什么？相同点又是什么？
    * 

17. diff的key值的作用？

18. 说说你认识的 BFC？
    * 什么是BFC？
    * 如何形成BFC？
    * BFC有哪些引用

19. 如何进行清浮动？(该背的就背牢固了)
   1. 块级元素 + clear: both;
   2. 虚拟元素 + clear: both;
   3. 父盒子 BFC

20. 什么时候触发gpu加速？
   1. transform
   2. opacity
   3. filter
    

21. webpack 懒加载如何实现？
  1. 使用 ES 7 的语法 import('.xxx') 进行静态打包优化     

22. 手写一个的防抖函数
    ```js
      function debounce (func, wait, immediate) {
        var timer = null

        return function {
          var self = this
          var args = arguments

          if (timer) clearTimeout(timer)

          if (immediate) {
            var callNow = !timer // 若非处于冷却期，则直接执行

            timer = setTimeout(function () {
              clearTimeout(timer)
              timer = null
            }, wait)

            func.apply(self, args)
          } else {

            timer = setTimeout(function () {
              clearTimeout(timer)
              timer = null
              func.apply(self, args)
            })

          }
        }
      }
    ```
    

23. 手写一个Promise
    ```js
    Promise.STATUS = {
      pending: 'pending',
      fulfilled: 'fulfilled',
      rejected: 'rejected'
    }

    function Promise (executor) {
      this.PromiseState = Promise.STATUS.pending
      this.PromiseResult = ''
      this.resolveCallbacks = []
      this.rejectCallbacks = []

      var _rejectFun = function (reason) {
        if (this.PromiseState !== Promise.STATUS.pending) return
        this.PromiseState = Promise.STATUS.rejected

        this.PromiseResult = reason
        this.rejectCallbacks.forEach(cb => cb(this.PromiseResult))
      }

      var _resolveFun = function (data) {
        if (this.PromiseState !== Promise.STATUS.pending) return
        this.PromiseState = Promise.STATUS.fulfilled

        this.PromiseResult = data
        this.resolveCallbacks.forEach(cb => cb(this.PromiseResult))
      }

      try {
        executor(_resolveFun.bind(this), _rejectFun.bind(this))
      }
       catch (err) {
        _rejectFun(err)
      }
    }

    Promise.prototype.then = function (userResolveFun, userRejectFun) {
      userResolveFun = typeof userResolveFun === 'function' ? userResolveFun : data => data
      userRejectFun = typeof userRejectFun === 'function' ? userRejectFun : reason => throw new Error(reason)  
        
      return new Promise(function (resolve, reject) => {
        var callbackHandler = function (callback) {
          try {
            var result = callback(this.PromiseResult)

            if(result instanceof Promise) {
              result.then(_data => {
                resolve(_data)
              }).catch(_err => {
                reject(_err)
              })
            } else {
              resolve(this.PromiseResult)
            }
          } catch (err) {
            reject(err)
          }
        }

        if (this.PromiseState === Promise.STATUS.pending) {
            this.resolveCallbacks.push(function () {
              callbackHandler(userResolveFun)
            })
            this.rejectCallbacks.push(function () {
              callbackHandler(userRejectFun)
            })
        }

        if (this.PromiseState === Promise.STATUS.rejected) {
          callbackHandler(userRejectFun)
        }

        if (this.PromiseState === Promise.STATUS.fulfilled) {
           callbackHandler(userResolveFun)
        }
      }) 
    }

    ```

24. promisify原理是什么？

```js
 function promisify (func) {
   return function (...excuteArgs) {
     var callback = function (err, ...data) {
           if (err) {
           reject(err)
         } else {
           resolve(...data) // 成功的回调参数可能不止一个
         }
      }
      var totalArgs = excuteArgs.push(callback)

      return new Promise(function (resolve, reject) {
         func.apply(this, totalArgs)
    })
   }
 }
```

------------node.js 相关题目---------------   

简述Node.js的EventLoop

Node.js为什么处理异步IO快？

Node.js有cluster、fork两种模式多进程，那么这两种情况下，主进程负责TCP通信，怎样才可以让子进程共享用户的Socket对象？
1. 主进程接收到用户的请求，获得了sockt句柄，使用IPC通信的形式传递给子进程   
2. 子进程根据socket文件启动一个tcp服务器进行处理    
3. 对外就像是主进程在处理     

Node.js多进程维护，以及通信方式：

看你简历上写，对koa源码系统学习过，请简述核心洋葱圈的实现
```js
function compose (middwares) {
   // 参数校验省略

  return function (context, next) {
    let deepestIndex = -1
    function dispatch (currIndex) {
      if (currIndex <= deepestIndex) return Promise.reject('xxx miltiple times')
      deepestIndex = currIndex

      var work = middware[currIndex]
      if (!work) return Promise.resolve()

      try {
         // 如果 bind 函数的参数列表为空，或者thisArg是null或undefined，执行作用域的 this 将被视为新函数的 thisArg。    
        return Promise.resolve(work(context, dispatch.bind(null, i + 1))
      } catch (err) {
        return Promise.reject(err)
      }
    }

    return dispatch(0)
  }
}
```

TCP可以快速握手吗？

TCP链接和UDP的区别，什么时候选择使用UDP链接？

为什么Vue的nextTick不稳定？
https://github.com/Ma63d/vue-analysis/issues/6

谈谈你对微前端的看法，以及实践

你有提到白屏时间，有什么办法可以减少吗？都是什么原理

其中有问到PWA的原理

Node.js的消息队列应用场景是什么？原理是什么？

介绍下你会用的自动化构建的方式

介绍一下Redis，为什么快，怎么做持久化存储，什么叫缓存击穿？

谈谈你对前端、客户端架构的认识？

用户就是要上传10个G的文件，服务器存储允许的情况下，你会怎么处理保证整体架构顺畅，不影响其他用户？


## 参考链接
[1] [参考1](https://www.jianshu.com/p/4f2cd3076b15)   
[2] [参考2](https://maiyong.github.io/2020/07/16/%E9%9D%A2%E8%AF%95/%E6%98%8E%E6%BA%90%E4%BA%91%E9%9D%A2%E8%AF%95/)       
[3] [参考3 - 知识点汇总，重点看](https://segmentfault.com/a/1190000021102583)        
