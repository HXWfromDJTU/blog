## Symbol 简介
> 我们知道Javascript有6种数据类型，string、number、boolean、function、undefined，object，ES6中新增一种 Symbol 类型
```js
typeof(Symbol("abc")) //symbol
```
___
## 特性
#### 永不重复
```js
let abc =Symbol("abc");
let abc2 = Symbol("abc");
abc == abc // false
```
#### 可全局注册管理
1️⃣ `Symbol`可以分为注册性的`Symbol`和非全局注册性的`Symbol`

2️⃣ `Symbol.for`能够生成一个可供全局搜索的`Symbol`，下次使用`Symbol.for`创建`Symbol`的时候，会先检查全局下是否有相同`key`的`Symbol`存在，若存在，则直接返回同一个`Symbol`对象。
🎈 有点儿像[单例模式](/design_mode/singleton.md)的意思 🎈
```js
let s1 = Symbol.for('foo');
let s2 = Symbol.for('foo');

s1 === s2 // true
```
#### 反向查找
`Symbol.keyFor`用于反向查找`Symbol`的`key`值，但必须曾使用`Symbol.for`进行全局定义过。
```js
let temp = Symbol("temp")
Symbol.keyFor(temp) // undefined

let globalSy = Symbol.for("globalSy")
Symbol.keyFor(globalSy) // "globalSy"
```
3️⃣ 这里说的全局有效，在浏览器端是能够跨国`iframe`访问共享的。


### 类型转换
1️⃣ 可以转化为字符串类型
```js
let sym = new Symbol('test');
console.log(sym.toString()); // "Symbol(test)"
console.log(String(sym))     // "Symbol(test)"
```
2️⃣ 也可以转换为布尔值
```js
console.log(!sym); // false
console.log(Boolean(sym)) // true
```
4️⃣ 但是做其他的类型转换就会发生类型错误
___
## 使用场景
##### 独一无二的对象key值
因为`symbol`有点像系统帮你生成了一个永远不会重复的随机`字符串`但不是`字符串`，`symbol`可以作为对象的独一无二`key`，可以防止对象后续的开发者会把这个属性值进行复写。
```js
var mySymbol = Symbol(); 
// 第一种写法 
var a = {}; a[mySymbol] = 'Hello!';
 // 第二种写法 
var a = { [mySymbol]: 'Hello!' };
 // 第三种写法 
var a = {}; Object.defineProperty(a, mySymbol, { value: 'Hello!' });
```
一般在编写类库的时候进行使用，类库开发者在开发时设置一些方便操作对象属性的`key`值，也不害怕外部使用者能够去复写这个对象属性。

🌈 当然还有著名的Symbol.itertor键名，用于对象的遍历器



##### 用于消除魔术字符串
这一点其实是生成独一无二key的拓展场景，当我们在做一些case语句判断的时候，或者if-else判断的时候，底层库的开发者并不知道后来的使用者会不会“撞大运”碰巧和自己设置的“key”相同，而导致不可预料的错误。

🔫 这个时候我们就需要使用Symbol生成一个独一无二的`key`来作为判断条件了

##### 作为私有属性的key
与上一点类似，不多赘述，不想被外部访问到，那自然就别让外部有机会操作你的key呗，更多[摸我](/ES6/es6_class.md)
___
### 访问

##### 访问对应值
1️⃣ 访问时请使用`[]`号包裹
2️⃣ 使用对象键值访问Symbol属性的时候，注意不要用`.`号，因为`.`会把后面跟随的内容，强制转换为字符串(使用`toString`方法)。
```js
console.log(a[mySymbol]); // "Hello!"
```
3️⃣ 反正注意一点，用symbol作为key存就用symbol作为key去取，用string作为key存就用字符串去取 🔑
4️⃣ 使用`for...of`与`for...in`是不能够获取到Symbol对象作为key的对对应值的

```js
let mySymbol = Symbol("mySymbol");
let a = {
  [mySymbol]: 'Hello!'
};
a.b = 123;
a.c = 'i am c';
for(let i in a){
    console.log(i); 
}
// b
// c
```

##### 访问对象上的Symbol属性
1️⃣ 使用一般的属性遍历手段，都是不可以获得对象上的Symbol类型的key的
2️⃣ 只有使用 `Object.getPropertySymbols`才能够取到一个装着对象上所有Symbol类型key的数组
3️⃣ ES6中新增的 Reflect.ownKeys 方法也可以遍历处包括Symbol key在内的所有key
```js
let obj = {
  [Symbol('my_key')]: 1,
   [Symbol('next_key')]: 1,
  enum: 2,
  nonEnum: 3
};
Reflect.ownKeys(obj)
//  ["enum", "nonEnum", Symbol(my_key)]
```


### 内置的Symbol key
1️⃣ `Symbol.hasInstance`  ▶️️  `instanceof运算`

2️⃣ `Symbol.isConcatSpreadable`  ▶️️  `Array.prototype.concat()运算`

3️⃣ `Symbol.species`  ▶️️  `创建衍生对象时，会使用该属性`

4️⃣ `Symbol.match`  ▶️️  `str.match(myObject)运算`

5️⃣ `Symbol.replace`  ▶️️  `String.prototype.replace运算`

6️⃣ `Symbol.search`  ▶️️  `String.prototype.search运算`

7️⃣ `Symbol.split`  ▶️️  `String.prototype.split运算`

8️⃣ `Symbol.iterator`  ▶️️  `for...of运算`

9️⃣ `Symbol.toPrimitive`  ▶️️  `发生类型转换的时候会触发`

1️⃣0️⃣ `Symbol.toStringTag`  ▶️️  `Object.prototype.toString运算`

1️⃣1️⃣ `Symbol.unscopables`  ▶️️  `与with的使用有关`