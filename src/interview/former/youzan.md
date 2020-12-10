1.http协议中301和302的区别
  * 301 表示永久重定向，会修改到浏览器中的书签
  * 302 是一个 表示临时重定向 http 1.0 标准下的状态码
  * 302 http协议中约定，重定向后的请求不应该对初始请求方法进行修改，但实际多数的实现中都改为了非POST请求
  * 因为一般来说 POST 请求具有非幂等性，重复发起会进引起问题
  * http 1.1 中使用了 303 与 307 去详细区分这两种请求
    * 303 表示 POST 请求会被改为 GET 进行重定向
    * 307 则和 http 1.0 中的 302 一样，默认不修改请求方法
  * ？？ 存储上是否有差别？
  * 补充
    * 303 会强制用 GET 方法请求新地址
    * 302 与 307 会在重定向前先得到用户的允许
    * 301 默认可缓存
    * 302、303、307 默认不可缓存

2.介绍下Restful
  * restful api是一种接口设计的风格规范，主要思想是 URL 就是行为状态的表现
  * https://host/action/1
  * GET POST PUT DELETE OPTION
  * 补充
    1. 域名 域名中划分更为细致， api.cctip.io login.cctip.io
    2. 版本 家路径中加入 api 版本号便于切换
    3. 路径 名词单数表示对象详情，名词复数表示对象的集合
    4. 动词 在URL中不使用动词，改为使用 method 进行表示
    5. 允许冗余，包容。  /zoo/animal?id=1232  与 /zoo/animal/1232，路径参数与URL参数都是可以接受的
    6. 返回数据中添加 文档链接

3.描述以下POST和PUT的区别
  * 本质上其实没有区别，都是http的请求，传递参数无非还是 body、header、url、cookie 这几种
  * POST 一般用于新增一个数据
  * PUT 一般表示更新一个数据

4.XSS攻击的场景能描述一个么？
  * XSS 含义为 Cross-Site-Scripting 跨站点脚本攻击
  * 一般分为 反射型、存储型、DOM型三种，区别在于恶意脚本出现的时机
    * 反射型：恶意脚本出现在访问的URL参数中，server取出并渲染到DOM中
    * 存储型: 恶意代码通过表单的形式发送给了服务器，服务器存储后，下次给浏览器提供数据展示时，被插入DOM中执行
    * DOM型: 没有后端的参与，前端从URL中获取某些内容渲染到DOM中被执行
  * 防护的方法:
    1. 表单输入白名单(账号密码等)
    2. 后端输出时进行过滤(黑名单)
    3. 渲染到DOM中时，启用模板引擎的防XSS功能
    4. 禁止访问，包括设定比较严格的 CSP(Content-Secure-Policy) 和 cookie http-only

5.介绍下304过程。
  * 304 Not Modified 是命中协商缓存服务器返回的状态码
  * 产生过程
    1. 浏览器对某个资源发起请求前，查看本地是否有缓存
    2. 检查 Expired 和 Cache-Control 等强缓存控制情况
        * 若是 no-store 则表示不允许缓存，则直接发起请求
        * no-cache 表示使用前先看看服务器有无更新的资源
        * 若为 public 或者 private，则看看是否超出 Max-Age 限制时间，若超出则向服务器发起请求
            1. 若未超时，则返回 200 (Fron Disk Cache) 或者 (From Memory Cache)
    3. 发起请求时，携带本地资源的协商缓存请求头
        * E-Tag 搭配 If-None-Match
        * Last-Modified 搭配 If-Modified-Since
    4. 若命中协商缓存，服务器则返回 304 Not Modified 的状态码
    5. 若没有命中，则走正常请求的流程，一般会返回 200 OK

6.说一下浏览器中的事件机制。
  * 浏览器的事件机制分为 事件捕获 和 事件冒泡两种
    * 可以利用事件的冒泡做事件委托的优化
        * target 与 currentTarget
        * 长列表中可以减少事件绑定的数目，优化性能
    * 可以利用 原生 的Api,中断事件的捕获和冒泡
    * ??? 了解的不够详细，待补充
  * 分为 DOM0  DOM1 DOM2 三种类型
    1. <div onClick="fucntion () {}">
    2. dom.on('event')
    3. dom.onEvent = function () {}
  * 区别
    1. 使用 DOM 2级别的事件，可以对一个DOM绑定多个监听事件
    2. 其他有待补充

7.简述一下防抖和截流，并口述一下防抖模拟的大致流程
  * 防抖
    * 描述: 在非立即执行模式下，在冷却(保护)时间内，事件频繁发生，冷却时间持续延迟，直到冷却时间超时才被触发一次
    * 实现: 
        1. 使用闭包修改一个函数的执行，全局中设定一个定时器变量。
        2. 当事件触发时，设定一个定时器，超时时执行回调函数
        ```js
            function debounce (func, wait, immediate) {
                var timer = null
                return function () {
                    var self = this

                    if (timer) clearTimerout(timer) // 事件被触发，当前有定时器，则直接清除

                    if (immediate) {
                        var callNow = !timer

                        timer = setTimeout(function () {
                            clearTimeout(timer)
                            timer = null
                        }, wait)

                        func.apply(self, arguments)
                    } else {
                        timer = setTimeout(fucntion () {
                            clearTimeout(timer);
                            timer = null
                            func.apply(self, arguments)
                        }, wait)
                    }
                }
            }
        ```
    * 节流
      * 流程: 在事件触发后立即响应时间，事件持续触发，在冷区期内不再响应，知道冷却期结束，再触发一次
        ```js
        var throttle = function (func, wait) {
            var timer = null
            var previous = 0

            return function () {
                var self = this
                var remaining = wait - (previous - new Date().getTime())

                if (remaining <= 0 || remaining > wait) {

                    // 设定空白冷却期
                    timer = setTimeout(function () {
                        clearTimeout(timer)
                        timer = null
                    }, wait)

                    // 立即执行
                    func.apply(self, wait)
                } else if (timer) {
                    timer = setTimeout(function () {
                        clearTimeout(timer)
                        timer = null
                        func.apply(self, wait) // 结尾执行一次
                    }, remaining)
                }
            }
        }
        ```
    

8.简述下浏览器的Event loop
  * 宏任务 微任务

9.请简述 == 机制
  * 值比较？？
  * 业务中严格全部使用 === 全等号进行条件判断

10.请简述js中的this指针绑定
  * this 指向当前的作用域 ??? 感觉不够官方
  * 在全局环境中，this 指向 window
    * 普通函数中，this 指向函数的调用者
    * 箭头函数中因为没有自己的 this，所以指向定义时的外层作用域
      * 也会随着外层作用域的this指向改变而改变
      * call、apply、bind 不能够修改箭头函数的 this 指向  
  ```js
    Function.prototype.myCall = function (context) {
        var that = context
        var args = Array.prototype.slice(arguments, 1)

        that.tempKey = this

        var evalStr = ''

        if (args.length > 0) {
            evalStr = 'that.tempKey(' + args.split(',') + ')'
        } else {
            evalStr = 'that.tempKey()'
        }

        const result = eval(evalStr)
        delete that.tempKey
        return result
    }
  ```
  ```js
  var myBind = function (context) {
      var bindingArgs = Array.prototype.slice.call(arguments, 1)

      var resFunc = function () {
          var excuteArgs = Array.perototype.slice.call(arguments)

          this.apply(new.target === resFun ? this, context, bindingArgs.concat(excuteArgs))
      }

      // 仿照继承，实现新函数的实例也可以继承父类对象
      resFunc.prototype = Object.create(this.prototype)

      return resFunc
  }

  ```

11.请简述原型链
  * 原型链是 Javscript 语言实现 OOP 的设计
    1. 利用 function 模仿 OOP 中的 Constructor
        * constructor 中的 this 用于定义实例属性
    2. 使用 constructor.prototype 模拟类公共属性
    3. 使用 _proto_ 属性指向实例的原型，用以搭建原型链

    ```js
    var _new = function (Ctor) {
        // 省略类型检测

        var obj = Object.create(Ctor.prototype) // 创建实例
        var args = Array.prototype.slice.call(arguments, 1)

        var retCtor = Ctor.apply(obj, args)

        var isLeagalObj = retCtor !=== null && typeof retCtor === 'object'

        return isLeagalObj ? retCtor : obj
    }

    var _enxtends = function (CtorA, CtorB) {
        // 省略类型检测

        var _proto = Object.create(CtorB.prototype) // 创建原型
        CtorA.prototype = _proto // 搭建原型关系
        _proto.constructor = CtorA
    }
    ```

12.说说你理解的闭包
    1. 闭包是

13.箭头函数
  1. 箭头函数的创建是为了区分function 用于面向对象设计，创建更纯粹的函数
  2. 箭头函数没有自己的 this 指向，他的内部 this 指向定义时外层作用域的 this
  3. 也不能够是用 call、bind、apply 改变其指向
  4. 因为没有自己的this指向
      * 不能够作为构造函数
      * 不能够使用 new 关键字进行调用

14.ES5继承实现
    如上图

15.说一下virtual Dom中key的作用
  * Virtual Dom 中的 key 用于简化 patch 过程的的 DOM 比对
  * 若两个 VDOM 的 key 相同，patch算法就认为这两个DOM是同一个节点
  * 所以说在 列表渲染中不能够使用 index 作为 key，在节点发生增减的时候，容易发生比对出错，导致更新出错

1.非覆盖式发布

4.项目经验，个人角色

5.gzip编码协议

1. Linux 754 介绍

2. 介绍冒泡排序，选择排序，冒泡排序如何优化

3. transform动画和直接使⽤用left、top改变位置有什什么优缺点 

4. 如何判断链表是否有环

5. 介绍⼆二叉搜索树的特点

6. 介绍暂时性死区

7. ES6中的map和原⽣生的对象有什什么区别

8. 观察者和发布-订阅的区别

9. react异步渲染的概念,介绍Time Slicing 和 Suspense

10. 16.X声明周期的改变

11. 16.X中props改变后在哪个⽣生命周期中处理理

12. 介绍纯函数

13. 前端性能优化

14. pureComponent和FunctionComponent区别

15. 介绍JSX

16. 如何做RN在安卓和IOS端的适配

17. RN为什什么能在原⽣生中绘制成原⽣生组件（bundle.js）

18. 介绍虚拟DOM

19. 如何设计⼀一个localStorage，保证数据的实效性

20. 如何设计Promise.all()

21. 介绍⾼高阶组件

22. sum(2, 3)实现sum(2)(3)的效果

23. react性能优化

24. 两个对象如何⽐比较


杭州有赞一面1h

1.js数据类型

2.js判断数据的方法

3.js获取对象key值的方法

4.js继承的方法

5.ES6的继承是用的ES5继承方法吗，用babel转化之后是代码是什么样的
   * ES6 中子类没有自己的this，必须执行super()，子类的this是从父类继承的

6.Symbel有了解吗

7.Http常见的状态码301 302是什么，304讲讲吧，我就说到了http缓存

8.http是无状态的，客户端和服务器的数据交互是怎么做到的，我说了cookie

9.服务端怎么给前端发送cookie，我说了用Set-Cookie，怎么让document.cookie无法访问cookie呢，可以去避免xss攻击，我说了设置一个HttpOnly标记

10.web安全攻击有哪些XSS,CSRF等等，然后问了具体怎么发生，怎么预防

11.Vue 组件中data为什么返回的是个函数呢

12.Vue中直接给数组项赋值，为什么视图不更新呢？说说原因

13.怎么解析Url对象

14.手写一个Promise.all方法

15.忘记了一点，还问了进程和线程，然后我就说到了js单线程，又说了页面渲染的过程，然后问js下载和解析会阻塞Dom Css 嘛，怎么解决，我说可以用async 或者defer 属性，问这两个的区别，没想到


杭州有赞二面40min

1.React和Vue的区别，怎么做技术选型

2.一个组件被很多页面引用，那怎么样做只需要请求一次ajax呢，提示我考虑浏览器相关的，我说了本地缓存，然后问了cookie localstorage的区别

3.实习中遇到很难的问题，怎么解决的

4.怎么学的前端

5.有什么要问的嘛




自我介绍

介绍项目

有了解echarts本身吗？

不用echarts类的工具，怎么绘制图表？

svg了解吗

为什么用vue做项目

了解vue的哪些东西

什么情况下用vuex

vue本身的更新机制了解吗？

observer和watcher了解吗

watch和computed内部原理

vue3.0有什么特性？

proxy和observe的区别？

object.defineProperty本身有什么限制？

object.breeze()内部是怎么实现的？

es6了解吗

let和const和var的区别

什么是块级作用域

除了函数还有哪些块级作用域

一次for循环有几个块

class内部是怎么实现的？

js基本数据类型

js引用类型

原型链了解吗？

可以用原型链实现class吗

哪些方法判断值的类型

typeof和instanceof有什么区别

instanceof的底层实现机制

css有哪些方法？

怎么实现垂直水平居中

position的值

绝对定位怎么实现水平居中

流式布局知道哪些

flex用过哪些属性

flex实现三列布局，左右定宽，中间自适应

css的选择器和对应的优先级

css前后设置了两个样式，应用哪些？

css的一个动画效果是

响应式具体是怎么实现的呢

字体大小自适应怎么做

rem和em的区别

实验室主要是做哪些工作

有接触算法和数据结构吗？你觉得最有意思的算法有哪些？具体是怎么实现的？

排序算法有哪些？说一下归并算法

手撕归并算法？？？后面让我任写一个排序算法

为什么用let定义变量

js本身的排序api

数组本身有哪些api

说一下filter、map、forEach、every、some

手写深度拷贝，并且把对象的属性改成驼峰类型

// 实现对象深拷贝 & key下划线转驼峰 ( a_bbb => aBbb、a_d_s => aDS )
const testData = {
a_bbb: 123,
a_g: [1, 2, 3, 4],
a_d: {
    s: 2,
    s_d: 3
},
a_f: [1, 2, 3, {
    a_g: 5
}],
a_d_s: 1
}

js新增了其他的数据类型吗

为什么选择前端

最近有什么关注什么技术方向吗

说一下csrf

get和post有什么区别？

tcp三次握手说一下

http基于什么实现的

http2.0有了解吗

https了解吗

https握手过程

http缓存说一下

强制缓存怎么设置

http头部字段有哪些
有什么想问我的？


面完我只想哭。

二面（40min）

自我介绍

什么时候开始学前端？

为什么要走前端方向？

最早做前端都是做些什么工作？

简历项目每个都介绍了一遍（三个）前端方向做了哪些工作？

用了ant-design为什么还要用bootstrap？

用了echarts为什么还要用amcharts？

canvas：有一条弯曲的道路，怎么绘制一辆小车在上面行走？

响应式有哪些方案？

实习做了什么项目？做了哪些工作？封装过哪些组件？

让你手写日期组件你会怎么做？

平时ajax请求是用封装的还是手写的？

知道ajax的原理吗？

get请求和post请求有什么区别？

在学校做过什么有挑战的事情？

node.js有了解过吗

学习node.js是通过什么方式？

前端工程化有了解吗

对我们公司有了解吗

对前端的新技术、新趋势了解吗？

对大前端了解吗

