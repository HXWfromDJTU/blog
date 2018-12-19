### 概述
1️⃣ 在目标对象的表面“架设”了一层拦截器，对目标的读和写都要经过这层东西
2️⃣ 和我们往常数值的 `get` `set` 函数相类似
3️⃣ 其实Proxy在Javascript中就是重载了我们常用的`.`运算符号

### get拦截
```js
var proxy = new Proxy({}, {
  get: function(target, property) {
// target 表示对象本身
// property 表示用户读取的属性名称
return 35;
  }
});
```
1️⃣ `new Proxy`后返回的对象，和传入的第一个参数对象，执行后会指向同一个内存中的对象
2️⃣ Proxy对象作为其他对象的原型的时候，使用者访问子对象的属性，找不到需要原型链向上查找的时候，找到了作为原型的Proxy，也会触发get拦截

### 拦截器的多样化
1️⃣ Proxy拦截器不仅能够拦截常用的get set方法（也就是点运算），Proxy能够拦截所有的方法和属性
```js
let proxy = {
construct(target,arg){
console.log('我被创建啦！！！')
return target;
}
apply(target,thisObj,arg){
   cosnole.log("妈妈咪呀....我有方法被借用啦")
}
}

```

2️⃣ 多样化拦截器的参数
无论拦截的是什么方法，第一个回调的参数就是这个对象本身，而后的参数就是调用这个方法本身所传递的参数，类似于以下这样
```js
proxyFun(target,...arguments);
// 第一个参数永远是对象本身
// 第二个参数开始，依次才是使用者调用这个方法传入的参数
```
##### Proxy一共支持拦截十三种方法

##### 1️⃣ `get(target, propKey, receiver)` 
➡️ proxy.foo
➡️ 7proxy['foo']。

##### 2️⃣ `set(target, propKey, value, receiver)`：
➡️ roxy.foo = v或proxy['foo'] = v

##### 3️⃣ `has(target, propKey)`
➡️  propKey in proxy的操作
```js
// 一般用于隐藏自身不想要被for...in遍历出来的元素。手动实现私有属性
var handler = {
  has (target, key) {
    if (key[0] === '_') {
      return false;
    }
    return key in target;
  }
};
```

##### 4️⃣ `deleteProperty(target, propKey)`：
➡️ ️delete proxy[propKey]

##### 5️⃣ `ownKeys(target)` 
➡️ `Object.getOwnPropertyNames(proxy)`
➡️ `Object.getOwnPropertySymbols(proxy)`
➡️ `Object.keys(proxy)`
➡️ `for...in循环`

##### 6️⃣ `getOwnPropertyDescriptor(target, propKey)`：
➡️ `Object.getOwnPropertyDescriptor(proxy, propKey)`

##### 7️⃣ `defineProperty(target, propKey, propDesc)`：
➡️ `Object.defineProperty(proxy, propKey, propDesc)`
➡️ `Object.defineProperties(proxy, propDescs)`

##### 8️⃣ `preventExtensions(target)`
➡️ `Object.preventExtensions(proxy)`

##### 9️⃣ `getPrototypeOf(target)`
➡️ `Object.getPrototypeOf(proxy)`

##### 1️⃣0️⃣ `isExtensible(target)`
➡️ Object.isExtensible(proxy)

##### 1️⃣1️⃣`setPrototypeOf(target, proto)`：
➡️ Object.setPrototypeOf(proxy, proto)

##### 1️⃣2️⃣`apply(target, object, args)`
➡️ proxy(...args)
➡️ proxy.call(object, ...args)
➡️ proxy.apply(...)

##### 1️⃣3️⃣ `construct(target, args)`
➡️ new proxy(...args)。


### Proxy.revocable()
```js
let target = {};
let handler = {};

let {proxy, revoke} = Proxy.revocable(target, handler);

proxy.foo = 123;
proxy.foo // 123

revoke();
proxy.fooßß
```
1️⃣ 当我们创建一个代理访问的对象后，完成了我们的功能之后，想要停止这个代理的通道，这时候我们需要使用到一个可以“撤回”的`Proxy`对象。
2️⃣ 撤回后，原对象`target`的访问并不受限，而再对proxy下的属性进行访问(或者其他被拦截的操作apply、new操作等)，就会触发报错
```js
VM5531:1 Uncaught TypeError: Cannot perform 'get' on a proxy that has been revokedß
```

### proxy的this指向
1️⃣ 一句话明确了：proxy中拦截器方法的this，指向的是proxy实例，不是原对象target(第一个回调参数)
2️⃣ proxy既然只是一个代理器，拦截器，自然也不能顺着原对象的原型链去做各种操作，比如说不能通过`instanceof`运算的检测

### 拓展“拦截器”的概念
1️⃣ 前面说的都是对一个对象的拦截，当我们一个类是用于生成一个资源服务器的(http服务器等)，那么我们在客户创建服务器的时候，返回一个使用Proxy对象包裹的服务器，就可以实现对客户每一个请求的拦截
2️⃣ 拓展：Proxy也可以做为数据库的ORM层



### 参考文章
[阮一峰ES 6教程 - Proxy](http://es6.ruanyifeng.com/#docs/proxy)