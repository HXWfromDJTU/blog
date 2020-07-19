# 对象和数组的拷贝

## 复制引用
使用直接赋值的方式，我们得到的效果一般就是浅拷贝，因为复制的只是对象和数组的引用地址。
```js
let a = {key:123};
let b = a;
b; // {key:123}
a === b; // true
```

## 浅拷贝

#### 数组分割与合并
💎 常用方法：`array.slice(0)` 和 `array.concat()`
只对数组进行了第一层的完全拷贝，第二层以及内部若存在对象或者数组，则也都只是复制了对象的引用。

#### Object.assign
💎 常用方法：`Object.assign`
Object.assign拷贝的是属性值，假如源对象对属性是一个指向对象的引用，也只会拷贝那个对象的引用值。
```js
let a = {key:124,aa:{key2:456}};
let b = Object.assign({},a);
b;  // {key:123,{key2:456}}
b === a; // false
b.aa = {key3:789};
a.aa; //{key3:789};
```

#### ...展开运算符
实现的效果仍然是首层内容的完全拷贝，对于第二层及以后都是只复制引用地址。

只复制第一层的拷贝，适用于只有单层内容(数组或者对象)的拷贝，速度快，不需要迭代。

## 深拷贝
> 深拷贝是要对对象以及对象的所有子对象进行拷贝。

###  JSON.Stringfy
使用`JSON.stringfy() + JSON.parse`进行转换
1️⃣ 将数据转换成一个字符串，然后再使用`JSON.parse`转换为`JSON`对象，并且分配一个新的对象。  
2️⃣ 但是`JSON.parse()`这个方法，只能够正确地处理 `Number`、`String`、`Array`等能够被`json`格式正确表达的数据结构。但是，`undefined`、`function`、`Symbol` 会在转换过程中被忽略。

```js
let obj = {a:1,b:'xxx'};
let copyObj =  JSON.parse(JSON.srtingfy(obj));
```

### 手写实现
 遍历对象上的所有属性，实现深度拷贝
```js
// 判断是否复杂类型，需要继续深入递归
let isComplex = data =>{
   let str = Object.prototype.toString.call(data);
   let dict = {
       '[object Array]':true,
       '[object Object]':true
   };
   if(dict[str]){
       return true;
   }else{
       return false;
   }
}


/**
 *  其他疑问  
 * 1 循环引用  
 * 2 引用丢失   
 * 3 使用递归，调用栈溢出  
 */

let deepCopy = function(target,source){
    let stack = [];// 使用一个数组作为调用栈，系统的调用栈，避免递归栈限制
    // 使用一个WeakMap存储已经拷贝过的对象
    let currentMap = new Map();
    for(let attr in source){
        if(isComplex(source[attr])){
            let hasAlready = currentMap.has(source[attr]); // 判断之前是否已经拷贝过一次 
            if(hasAlready){
                target[attr] = source[attr]; // 若已经拷贝过，则将原来拷贝的一份取出来(也包括嵌套的问题，因为不再取去拷贝了)  
            }else{  
                let result = new Object()
                result = deepCopy(result, source[attr]); 
                currentMap.set(result,result); // 存储
                target[attr] = result; 
            }
        }else{
            target[attr] = source[attr];
        }
    }
    return target;
}

```

### lodash.cloneDeep
在项目中我们要深拷贝一个复杂对象，首选的肯定是`lodash`的`cloneDeep`

cloneDeep的源码就没补一行行分析了，总体来说离不开以下几个关键点
* ##### 

### 原生深度拷贝算法

深度拷贝算法是浏览器内核，某些API需要进行深拷贝时候的内部处理方法，暂未直接对外开放，但我们可以借用这几个API来实现深拷贝。先看看MDN的描述👇[传送门](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm#Supported_types)

> The structured clone algorithm copies complex JavaScript objects. It is used internally to transfer data between Workers via postMessage(), storing objects with IndexedDB, or copying objects for other APIs. It clones by recursing through the input object while maintaining a map of previously visited references, to avoid infinitely traversing cycles.


#### MessageChannel
```js
// target = obj
const {port1, port2} = new MessageChannel();
port2.onmessage = ev => resolve(ev.data);
port1.postMessage(obj);
```

#### History API
```js
// target = obj
history.replaceState(obj, document.title);
const copy = history.state;
```

当然,这部分知识不建议在生产中使用，权当是拓展自己的视野。

## 参考资料
[1] [The structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm#Supported_types)

[2] [JavaScript 深拷贝性能分析 - 掘金](http://t.cn/Rucl0qE)     
[3] [lodash源码浅析之如何实现深拷贝](https://juejin.im/post/5e7378656fb9a07cb3460948)
