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
`Symbol`可以分为注册性的`Symbol`和非全局注册性的`Symbol`

`Symbol.for`能够生成一个可供全局搜索的`Symbol`，下次使用`Symbol.for`创建`Symbol`的时候，会先检查全局下是否有相同`key`的`Symbol`存在，若存在，则直接返回同一个`Symbol`对象。
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
#### 不可被枚举
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
在使用遍历器遍历的时候，`Symbol`作为`key`值的属性并不会`枚举列表`中存在。只能够使用`Object.getOwnPropertySymbols`来获取该对象上的`Symbol`属性组成的集合。
#### 如何获取
##### Reflect.ownKeys
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
##### getOwnPropertySymbols
```js
Object.getOwnPropertySymbols(obj)
// [Symbol(my_key),Symbol(next_key)]
```
___
## 使用场景
#### 独一无二的对象key值
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
##### 访问
使用对象键值访问Symbol属性的时候，注意不要用`.`号，因为`.`会把后面跟随的内容，强制转换为字符串(使用`toString`方法)。
```js
console.log(a[mySymbol]); // "Hello!"
```
#### 