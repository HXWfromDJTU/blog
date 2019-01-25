## 类型检测
![](/blog_assets/type_inspect.png)
___
#### 四种主要的方法
1、`typeof`
2、`instanceof`
3、`Object.prototype.toString`
4、`constructor`

前二者根据数据类型做判断

后二者根据构造函数做判断

### typeof
type是解释器内部实现，根据ECMA-262规定的几种类型的值来返回类型名称
只能够判断出来适用对象字面量方式赋值的基本数据类型，例如：
```js
    // 基本类型
var  a = 123;
    typeof(a)   // number
    typeof(NaN)  // number
    typeof(Infinity) // number

var  b = "string";
    typeof(b)   // string

var  c = true;
    typeof(c)   // boolean

var  d;
    typeof(d)   // undefined

var  e = null;
    typeof(e)   // object

    // 引用类型
var  f = [1,2,3];
    typeof(f)   // object

var  g = {};
    typeof(g)   // object

var  fun = function () {};
    typeof(fun) // function

   // 无法识别使用 String 与 Number 构造器生产出来的对象
var  A = new Number(123);
    typeof(A)   // object    
    A instanceof Number  // true

var  B = new String("123");
    typeof(B)    // object
    B instanceof String  // true
```
`typeof` 测试的结果并不是特别的准确，并且只能检测使用字面量命名的基本数据类型（除了 `null`）。所以我们一般不使用 `typeof` 进行数据检测。

优点：能够方便检测出 对象字面量的类型
缺点：
① 不能够检测使用构造函数生成的对象  
② 不能够区分出 `Array` `Object`  `null`  
#### typeof 原理  
在 javascript 的最初版本中，使用的 32 位系统，为了性能考虑使用低位存储了变量的类型信息： 
`000`：对象
`1`：整数
`010`：浮点数
`100`：字符串
`110`：布尔
`undefined`：用 - （−2^30）表示。
`null`：对应机器码的 NULL 指针，一般是全零。

##### typeof底层C++的判断逻辑  
```cpp
if (JSVAL_IS_VOID(v)) {  // (1) 判断是否为 undefined
    type = JSTYPE_VOID;
} else if (JSVAL_IS_OBJECT(v)) {  // (2) 如果不是 undefined，判断是否为对象
    obj = JSVAL_TO_OBJECT(v);
    if (obj &&
        (ops = obj->map->ops,
            ops == &js_ObjectOps
            ? (clasp = OBJ_GET_CLASS(cx, obj),
            clasp->call || clasp == &js_FunctionClass) 
            : ops->call != 0
        )
       ) {  
        type = JSTYPE_FUNCTION; // 判断为function
    } else {
        type = JSTYPE_OBJECT; // 判断为 object
    }
} else if (JSVAL_IS_NUMBER(v)) {  // 如果不是对象，判断是否为数字
    type = JSTYPE_NUMBER;
} else if (JSVAL_IS_STRING(v)) { // 判断是否是字符串 
    type = JSTYPE_STRING;
} else if (JSVAL_IS_BOOLEAN(v)) { // 如果不是对象，判断是否为Boolean
    type = JSTYPE_BOOLEAN;
}
```
这样一来常见的`typeof null`的bug就很明显了，结果仍然是和对象一样的 `000`。

typeof原理部分，来参考资料 [JavaScript中typeof原理探究？ -by justjavac](https://segmentfault.com/q/1010000011846328)

### instanceof
`insatnceof`的原理是根据原型链向上查找，有一个局限性就是第二个参数必须是对象或者构造函数。     
[instanceof的模拟实现](/algorithm/instanceof.js)
```js
//  与 typeof 基本相反，不能够有效地检测字面量的类型
"stringTest"  instanceof  String  //false
(new String('testString')) instanceof String  // true
```
优点：能够检测 使用构造函数生成的变量对象   也能够区分出 `Array` `Object`  `Fucntion`
缺点： 不能够检测出对象字面量形式的`基础类型`数据，比如`123-Number` `abc-String`  `true-Boolean`    

### Object.protype.toString.call()
```js
  // 字面量的检测
var a = 123;
Object.prototype.toString.call(a)    // [object Number]

var b = "string";
Object.prototype.toString.call(b)    // [object String]

var c = [];
Object.prototype.toString.call(c)    // [object Array]

var d = {};
Object.prototype.toString.call(d)    // [object Object]

var e = true;
Object.prototype.toString.call(e)    // [object Boolean]

var f =  null;
Object.prototype.toString.call(f)    // [object Null]

var g;
Object.prototype.toString.call(g)    // [object Undefined]

var h = function () {};
Object.prototype.toString.call(h)    // [object Function]

    class  fun{}
 Object.prototype.toString.call(fun)  // [object Function]

    // 构造器生成的对象的检测
var A = new Number();
Object.prototype.toString.call(A)    // [object Number]
```
优点：能够正常区分所有形式的变量类型
ps：就连不常用的日期和正则对象都可以无误地检查出来
缺点：返回的是一个混合型的字符串


### constructor


```js
// 使用 constructor基本可以获得所有的类型
var a = 123;
    console.log( a.constructor == Number);    // true

var b = "string";
    console.log( b.constructor == String);    // true

var c = [];
    console.log( c.constructor == Array);    // true

var d = {};
    console.log( d.constructor == Object);    // true

var e = true;
    console.log( e.constructor == Boolean);    // true

var h = function () {};
    console.log( h.constructor == Function);    // true

var A = new Number();
    console.log( A.constructor == Number);    // true

var A = new Number();
    console.log( A.constructor == Object);    // false

    //  因为不存在原型链，所以无法访问
var f =  null;
    console.log( f.constructor == Null);    //  TypeError: Cannot read property 'constructor' of null

var g;
    console.log( g.constructor == Undefined);    // Uncaught TypeError: Cannot read property 'constructor' of
    undefined
```
优点：能够正常检测 `对象字面量` 与 `构造函数生成的对象`
缺点：不能检测 `null` 与 `undefined` 

___
### 参考文章
[JS类型检测 -by 小倩](https://juejin.im/post/59b5540c5188257e8769e95d)
