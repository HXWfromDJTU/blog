## 简答题
### Doctype 严格模式  与 混杂模式 的区别在哪里？
* 

### 哪些操作会造成内存泄露

### 说说MVC框架的理解


### 比较深刻的技术难题是什么？如何解决的呢？


### 去除数组中重复的元素。

### 求出1000以内，所有的3和5的倍数之和。

### 如何对网站的文件和资源进行优化
* 文件合并，以减少http请求
* 文件上线前的压缩/最小化，减小下载文件的体积。
* 上线后使用CDN资源托管
* 使用缓存

### 从服务器主动推送资源到客户端的方式？
* 使用HTML5 的websocket
* webscoket通过Flash
* XHR长时间链接
* XHR Multipart Streaming
* 使用不可见的Iframe

### javascript的with用法
* 代替作用域内，所有掉用链的头部
* 优点是可以简化调用链的写法
* 缺点是使得代码更加难维护

### void 的意思是什么？
* 表示后面的表达式，不返回任何值
* 但void()括号中的表达式，仍要执行，只是不返回任何值

### IE和DOM事件流的区别(待补充)
* IE采用冒泡型事件，DOM使用先捕获后冒泡事件
* 事件侦听函数的参数不一样
* this指向不同，`IE`下事件的绑定`this`指向`window`

### 在ES6中提供了（）用于二进制的操作。(待了解)
* ArrayBuffer、TypeArray、DataView

### css reset的意义是什么？
* 因为浏览器的表现存在差异，而我们开发却希望能够从同一起跑线开始
* 所以尽量抹平这些差异
* 常见的是清理 `margin`值，和`ol``ul`顺序序列的基本样式
```css
body, dl, dd, h1, h2, h3, h4, h5, h6, p, form{margin:0;} 
 ol,ul{margin:0; padding:0;}
```
* 常见使用 `reset.css`、`Normalize.css`

### 重绘和重排如何区分？
* `reflow`:当render树中的一部分或者全部因为大小边距等问题发生改变而需要重建的过程叫做回流
   * 重排是因为dom元素的width、height、margin、padding发生了变化
   * 或者窗口发生了`resize`
   * 在获取一些 和元素位置相关的属性时，浏览器为了确保正确性，会触发重排影响性能
      常见的有：`offsetTop、offsetLeft、 offsetWidth、offsetHeight、scrollTop、scrollLeft、scrollWidth、scrollHeight、 clientTop、clientLeft、clientWidth、clientHeight、getComputedStyle() (currentStyle in IE)`
* `repaint`:当元素的一部分属性发生变化，如外观背景色不会引起布局变化而需要重新渲染的过程叫做重绘
    * 重绘只是因为元素不影响布局的属性发生了变化，一般是颜色、背景颜色等

重排一定会引起重绘
重绘不一定会引起重排



### html5 新的布局标签
* header、footer、nav、menu、artical、section、figure、aside、hgroup

### CSS属性position有哪些属性值？ 
* relative
*  absolute
* fixed
* static  正常参加排序，没有特殊定位，设置的`top`、`left`、`right`、`bottom`、`z-index`值都无效

### ES 6 的class 关键字，与 new 关键字是如何实现 polyfill 的？
*  例如 `ar jay = new Person();`
1. 创建一个空对象
2. 将构造函数的作用域赋给新对象（this指向新对象）
3. 执行构造函数中的代码（为新对象添加属性）
4. 返回新对象（返回this）

### 如何使用 es 3、es 5、es 6 分别 实现继承？
#### ES 3
1.   利用 Person.call(this) 执行“方法借用”，获取 Person 的属性
2.    利用一个空函数将 Person.prototype 加入原型链
关键代码
```js
function inheritProto(Parent, Child) {
  var Fn = function() {};
  Fn.prototype = Parent.prototype;
  Child.prototype = new Fn();
  Child.prototype.constructor = Child;
}
```
#### ES 5
 1.   利用 Person.call(this) 执行“方法借用”，获取 Person 的属性
 2.   利用 ES5 增加的 Object.create 方法将 Person.prototype 加入原型链
 关键代码
 ```js
Bob.prototype  = Object.create(Person.prototype, {
  constructor: {
    value: Bob,
    enumerable: false,
    configurable: true,
    writable: true
  }
});
 ```

#### ES 6
* 利用 ES6 增加的 class 和 extends 实现比以前更完善的继承
关键代码
```js
class Bob extends Person {
  constructor() {
    super("Bob");
    this.hobby = "Histroy";
  }
```

### JS的继承与Java有什么不同之处

#### Java
ava 中的类就像对象的设计图，每次调用 new 创建一个新的对象，就产生一个独立的对象占用独立的内存空间

#### Javascript
在 JavaScript，继承所做工作实际上是在构造原型链，所有子类的实例共享的是同一个原型。所以 JavaScript 中调用父类的方法实际上是在不同的对象上调用同一个方法，即“方法借用”，这种行为实际上是“委托（delegation）”调用


### http与https有什么区别
1. http 的URL 以http:// 开头，https以https:// 开头
2. http 标准端口是80 ，https是443
3. https 协议需要到ca申请证书，http不需要。
4. http 是超文本传输协议，信息是明文传输，https 则是具有安全性的ssl加密传输协议
5. http 的连接很简单,是无状态的，https协议是由SSL+http协议构建的可进行加密传输、身份认证的网络协议 要比http协议安全
优点：
1.  通过证书可以更信任服务器
2.  更安全，防篡改
缺点：
1.  https 需要证书。
2.  因为对传输进行加密，会一定程度增加cpu消耗。
3.  由于https 要还密钥和确认加密算法的需要，所以首次建立连接会慢一些。
4.  带宽消耗会增加。

### 如何进行一个无序数组的排序
* 冒泡排序
* 快速排序

