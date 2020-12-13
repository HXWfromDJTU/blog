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
  1. 


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
const a = {
    values: [1, 2, 3]
    get () {
        return this.values.shfit()
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


8. 如何设置浏览器缓存与不缓存两种。


9. 如何解决跨域问题?
1. jsonp
2. CORS  - Assess-Control-Allow-Origin
3. proxy-server nginx node
4. postMessage
5. websocket 直接跨域


1. 简述一下弹性（flex)布局有哪些属性，各属性有什么作用

2. 请用css3画出一个扇形

3. 用css定义一个宽高不定，水平垂直居中的弹窗。   

4. 直接上代码，问alert会弹出些什么。
```js
function test(a, b){
  //debugger 想不通就去单步调试
  alert(b);
  return {
    test: function(c) {
      return test(c,a);
    }
  }
}

var a = test(100);a.test(101);a.test(102);
var b = test(200).test(201).test(202);
var c = test(300).test(301);c.test(302);
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

5.5 Vue 与 React 的异同点是什么？   

6. 要求实现常用的排序算法

7. 以vue或是react为例，画出生命周期图？

8. 如果要你掌握一门后端语言，你会使用那一门？ 为什么？

9. 请使用ES6实现一个工厂模式。

10. vueRouter history模式与hash模式有什么区别？

11. Proxy解决了什么问题

12. vue data为何要是function

13. nextTick

14. 常用的闭包有哪些？

141. 盒子模型怎么理解？ 

15. 写一下双飞翼布局、圣杯布局

16. React 与 Vue 的区别是什么？相同点又是什么？
    * 

17. diff的key值的作用？

18. 说说你认识的 BFC？
    * 什么是BFC？
    * 如何形成BFC？
    * BFC有哪些引用

19. 如何进行清浮动？(该背的就背牢固了)

20. 什么时候触发gpu加速？

21. webpack 懒加载如何实现？

22. 手写一个的防抖函数

23. 手写一个Promise

24. promisify原理是什么？

------------node.js 相关题目---------------   

25. 简述Node.js的EventLoop

26. Node.js为什么处理异步IO快？

27. Node.js有cluster、fork两种模式多进程，那么这两种情况下，主进程负责TCP通信，怎样才可以让子进程共享用户的Socket对象？

28. Node.js多进程维护，以及通信方式：

29. 看你简历上写，对koa源码系统学习过，请简述核心洋葱圈的实现：

30. TCP可以快速握手吗？

31. TCP链接和UDP的区别，什么时候选择使用UDP链接？

32. 为什么Vue的nextTick不稳定？

33. 谈谈你对微前端的看法，以及实践

34. 你有提到白屏时间，有什么办法可以减少吗？都是什么原理

35. 其中有问到PWA的原理

36. Node.js的消息队列应用场景是什么？原理是什么？

37. 介绍下你会用的自动化构建的方式

38. 介绍一下Redis，为什么快，怎么做持久化存储，什么叫缓存击穿？

39. 谈谈你对前端、客户端架构的认识？

40. 用户就是要上传10个G的文件，服务器存储允许的情况下，你会怎么处理保证整体架构顺畅，不影响其他用户？


## 参考链接
[1] [参考1](https://www.jianshu.com/p/4f2cd3076b15)   
[2] [参考2](https://maiyong.github.io/2020/07/16/%E9%9D%A2%E8%AF%95/%E6%98%8E%E6%BA%90%E4%BA%91%E9%9D%A2%E8%AF%95/)       
[3] [参考3 - 知识点汇总，重点看](https://segmentfault.com/a/1190000021102583)        
