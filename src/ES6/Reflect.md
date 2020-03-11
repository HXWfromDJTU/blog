# Reflect
### 简介
1️⃣ 将一些Object对象上，明显属于语言内部对象的的方法迁移到Reflect对象上。现阶段，这些方法能够在Object上和Refkect上找到，但是新增的方法就只能在Reflect上找到了。
2️⃣ 修改以往一些在Object对象上的方法最后的处理方式，使其更加合理。
3️⃣ 尽可能的把以往Object上的一些对象行为，修改为Reflect的函数行为
4️⃣ Reflect对象总是和原对象的Proxy进行同步，Proxy上有的属性，Reflect上也会拥有。


### 作用
1️⃣ 逐渐迁移、修复原来Object对象上的对象操作方法
2️⃣ 结合Proxy实现观察者模式
```js
const queuedObservers = new Set();

const observe = fn => queuedObservers.add(fn);
const observable = obj => new Proxy(obj, {set});

function set(target, key, value, receiver) {
  const result = Reflect.set(target, key, value, receiver);
  queuedObservers.forEach(observer => observer());
  return result;
}
```
TODO: 添加Vue中Reflect和Proxy结合使用的笔记📒

### 参考文章
[阮一峰ES 6教程 - Reflect](http://es6.ruanyifeng.com/#docs/reflect)
