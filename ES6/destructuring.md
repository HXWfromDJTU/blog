# 解构赋值

### 数组的解构赋值
1️⃣ 数组的不完全解构
```js
let [a, [b], d] = [1, [2, 3], 4];
// a = 1 ,b = 2 ,c =4
```
2️⃣ 解构赋值的等式，等号的右边部分必须是`可以被遍历的对象`，比如说是数组、generator等，或者你手动给它添加上[Symbol.iterator]对象就可以
3️⃣ 解构赋值时，当一个位置的值全等于(`===`) undefined 的时候，我们为某个量提前设置的默认值便会生效
```js
let [x = 1] = [undefined];
```
4️⃣ 字符串的解构赋值时，把字符串当做一个字符数组来对待
5️⃣ Map与Map也可以类似于数组一样结构赋值，顺序是按照iterator接口遍历出来的顺序

### 对象的解构赋值
1️⃣ 和数组根据下标顺序赋值不一样，对象根据的是对象key的对应来实现赋值的。
2️⃣ 注意ES6中对象的缩写，`{myValue,fun}`实际上是`{myvalue:myValue,fun:fun}`的缩写，解构赋值正是利用了这个特性。
```js
let {myValue:abc,fun}  = {myValue:123,qqq:999}
```
根据前面的规则看出，abc和qqq才是要被声明和赋值的变量，所以上面输出的结果是
```js
myValue // not defined 报错
abc // 123
fun // undefined
qqq // not defined 报错
```

### 其他类型解构赋值
1️⃣ 数值 与 布尔值
```js
let {toFixed: s} = 123;
s === Number.prototype.toString // true

let {toString: s} = true;
s === Boolean.prototype.toString // true
```
上面的操作实际是
```js
let proto123 = Object(123);
proto123 === Number.prototype // true
let {toFixed:s} = proto123;
// 相当于从数值类型的原型对象中解构赋值
```

2️⃣ null 与 undefined 
解构赋值的规则是，只要等号右边的值不是对象或数组，就先将其转为对象。由于undefined和null无法转为对象，所以对它们进行解构赋值，都会报错。
```js
let { prop: x } = undefined; // TypeError
let { prop: y } = null; // TypeError
```


### 函数参数的解构赋值
1️⃣ 基本规则和类型解构一样
2️⃣ 当解构失败(对应值等于`undefined`时候)，或者在上述类型解构的时候发生`Error`的情况，函数参数的解构都直接等于默认值。但是谨记，若传入的参数解构发生`Error`,但却没有设置默认值，那么参数解构就会报出`TypeError`

### 注意 与 用途
1️⃣ 解构的时候能不适用圆括号就尽量不使用。
2️⃣ 交换多个变量的数值的时候，可以使用结构十分方便
```js
[x,y] = [y,x];
```
3️⃣ 从一个复杂结构中，轻松取出想要的值，特别是提取JSON数据中的内容
4️⃣ 函数参数使用解构赋值(使用对象解构)的时候，可以不用再考虑参数的顺序，按照key去对应