# 对象的拓展

### 类静态方法（Object）
1️⃣ Object.is(obj1,obj2)  使用“Same-value equality”（同值相等）的原则去比较两个值是否相等，基本和`===`相等，而且修复了`NaN`不等于自身的问题

2️⃣ Object.assign     
☎️ 方法用于对象的合并，将源对象（source）的所有可枚举属性，复制到目标对象（target）。返回的是原对象（也就是第一个参数）。
🀄️  本方法实行的是浅拷贝。
♻️  实行的是同名属性，后面对象会覆盖前面对象。
💎  本方法也可以用于操作数组，会根据下标去覆盖前一个的值。
❤️  后者只会覆盖前者的同名属性值，而不会覆盖前者的访问器（get/set）
➡️➡️➡️ 一般用途：① 给对象添加方法 ② 对象浅拷贝(通过给一个空对象覆盖属性) ③合并多个对象  ④ 在函数中，可以手动模拟参数默认值  

3️⃣ Object.getOwnPropertyDescriptors()   返回指定对象所有自身属性（非继承属性）的描述对象。

4️⃣ Object.setPrototypeOf()，Object.getPrototypeOf()  用作操作 __proto__ 链上的对象。前者相当于 obj.__proto__ = xxx ，后者相当于访问 obj.__proto__

5️⃣ Object.keys()，Object.values()，Object.entries()  结果与数组的遍历相似，不赘述  

6️⃣ Object.fromEntries()     是Object.entries()的逆操作，通过一个`[[key:value],[key:value]]`的数组反向生成一个对象

### 其他特性
1️⃣ key：value的简写
2️⃣ 允许表达式作为key，但需要注意，建议使用引用型对象作为key的一部分，因为会强制转换为string
```js
let propKey = 'foo';

let obj = {
  [propKey]: true,
  ['a' + 'bc']: 123
};
```
### 属性(key)的获取
1️⃣ `for...in`   循环遍历对象自身的和继承的可枚举属性（不含 Symbol 属性）。
2️⃣ `Object.keys`  返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含 Symbol 属性）的键名。
3️⃣ `Object.getOwnPropertyNames`  返回一个数组，包含对象自身的所有属性（不含 Symbol 属性，但是包括不可枚举属性）的键名。
4️⃣ `Obejct.getOwnPropertySymbols`  返回一个数组，包含对象自身的所有 Symbol 属性的键名。
5️⃣ `Reflect.ownKyes`  强行获取  返回一个数组，包含对象自身的所有键名，不管键名是 Symbol 或字符串，也不管是否可枚举。

##### 获取键的先后顺序：
1️⃣ 首先遍历所有数值键，按照数值升序排列。
2️⃣ 其次遍历所有字符串键，按照加入时间升序排列。
3️⃣ 最后遍历所有 Symbol 键，按照加入时间升序排列。

### 对象中的super关键字
1️⃣ 在对象的方法中，可以是使用对象`super`关键字去获取对象原型上的属性
2️⃣ 谨记`super`关键字不能够单独使用，`super`关键字不能够在对象的属性值中出现，只能够出现在对象的方法中。

### 对象与拓展运算符
1️⃣ 可以用于快速合成参数对象


___
### 参考文章
[阮一峰的ES6教程](es6.ruanyifeng.com/#docs/object)
