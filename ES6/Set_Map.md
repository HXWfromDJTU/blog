# 大有用途的 Set & Map
![set](../blog_assets/set.gif)

* `Set`可以接受一个具有`iterable`接口的数据作为创建基础
```js
 const set = new Set([1,3,4,5,6]); //数组
 const domSet = new Set(docuemnt.querySelector("div")); //DOM数组
```
也可以传入 类数组
![set](../blog_assets/arguSet.gif)

1️⃣  `Set`中的重复检测
  🎦 其规则类似于`===`的校验(唯一区别是，`NaN`在Set中也不可以重复)。
  🎦 两个对象的引用也总是不相同的，所以`Set`中允许存在值相同的对象。
2️⃣ 使用`Set`可以实现一堆数据去重的工作（从前一般使用JS对象key的唯一性实现）
3️⃣ Set 结构的键名就是键值(两者是同一个值),在遍历的时候有体现出来

##### Api
1️⃣⃣ `add(value)`：添加某个值，返回 Set 结构本身。
2️⃣ `delete(value)`：删除某个值，返回一个布尔值，表示删除是否成功。
3️⃣ `has(value)`：返回一个布尔值，表示该值是否为Set的成员。
4️⃣ `clear()`：清除所有成员，没有返回值。


4️⃣  `Array.from`方法可以将`Set对象`转换成为`Array对象`
### Set的遍历
1️⃣  `keys()`：返回`键名`的遍历器
2️⃣⃣  `values()`：返回`键值`的遍历器
3️⃣  `entries()`：返回`键值数组`的遍历器
4️⃣  `forEach()`：使用回调函数遍历每个成员,可以直接得到成员本身
5️⃣  返回的遍历器(Iterator)对象，可以使用`for循环`等方法进行遍历。

#### 应用场景
1️⃣ 使用Set去重的特性，再加上`...`拓展运算符，实现一行代码数组去重
2️⃣ 利用`...`云算符，快速转换为数组元素，通过filter函数过过滤不符合条件的元素，然后实现`并集``交集`、`差集`
```js
let a = new Set([1, 2, 3]);
let b = new Set([4, 3, 2]);

// 并集
let union = new Set([...a, ...b]);
// Set {1, 2, 3, 4}

// 交集
let intersect = new Set([...a].filter(x => b.has(x)));
// set {2, 3}

// 差集
let difference = new Set([...a].filter(x => !b.has(x)));
// Set {1}
```
3️⃣ 利用遍历直接修改内部元素
#### WeakSet
1️⃣ WeakSet的接口方法和Map完全一样
2️⃣ WeakSet内部的元素并不会计入垃圾回收的计数，所以原对象只要被释放，这边的引用也会消失
3️⃣ 因为内部元素的不稳定，所以我们无法`遍历`、`计数`（也就是读取其length属性）
4️⃣ 因此`WeakSet` 适合临时存放一组对象，以及存放跟对象绑定的信息。只要这些对象在外部消失，它在 WeakSet 里面的引用就会自动消失。比如说DOM对象。
5️⃣ WeakSet也只能够存储对象，不能够存储一般对象。

___
## Map
1️⃣ Map 也就是我们常用的字典集概念，与我们常用的原生Javascript对象十分相似,区别在于Map对象可以使用值作为键，不再限制于字符串
2️⃣ 初始化的时候，可以传入一个也可以接受一个双元素数组作为参数。
```js
// 使用数组创建
const dobleProArr = [
    ["name":"小李"],
    ["id":"456"],
    ["height":175]
];
const map1 =  Map(dobleProArr);
map1.get("name"); //小李
map1.get("id"); //456
```
注意使用数组创建的时候，”键值对“是存放在一个数组的0、1号元素中，而不是传统的{}中
```js
// 逐个添加
const map2 = new Map();
map2.set('myValue',123);
map2.set(window,"win");
map2.get(window); // 'win'
```
#### 遍历与转换
1️⃣ 遍历的方法与Map相类似，请参考上文
2️⃣ 使用...拓展运算符，相当于entires()
#### WeakMap
1️⃣ 就像WeakSet只能存储对象一样，WeskMap只能够使用引用型对象作为键值，不能够使用一般对象作为键值。
2️⃣ 其指向的对象也是不计入垃圾回收的。
3️⃣ WeakMap回收实例，[传送门](https://github.com/ruanyf/es6tutorial/issues/362#issuecomment-292451925)

___
### 二者差异
1️⃣ Set注意提倡存，可以批量存，也可以单个存。但不能够单独一个个取出来。只能够通过遍历取得元素。而Map可以单独存，单独取出。
2️⃣ WeakMap与WeakSet存放的数据都是不稳定的，不计入垃圾回收计数。
3️⃣ Set存储的是[值，值]对，值和值都是相等的。而Map存储的是[对象，值]对，”键值“可以是任意对象，可以和值不一样。
4️⃣ 想要直接遍历出Set和Map的内容请使用forEach,其他方法生成的都是遍历器对象。

___
### 参考文章
[阮一峰 ES6教程 - Set_Map](http://es6.ruanyifeng.com/#docs/set-map)