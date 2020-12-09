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
    5. 405 ？？？
  * 5xx 一般表示服务器错误
    1. 500 表示内部服务器错误
    2. 502 Bad Gateway 网关错误，尝试强制刷新页面，不行再找后端负责的同学
    3. 503 服务暂时不可用
    4. 504 ？？？

2.假如移动端设备的尺寸是640px要实现每1rem=16px怎么实现？ 
  1. 


3.请使用css画出三角形 
 ```css
 /* 1. 多变形是使用四边宽度一致，但是三边颜色透明来实现。
    2. 减小宽度来隐藏，会影响显示图形 */
 .triangle {
     width: 0;
     height: 0;
     border-width: 0 0 100px 0;
     border-color: red;
 } 
 ```


4.请使用css画出梯形 
```css
.retangle {
    width: 20;
    height: 0;
    border-width: 50px;
    border-color: green;
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