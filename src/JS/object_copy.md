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
* 将数据转换成一个字符串，然后再使用`JSON.parse`转换为`JSON`对象，并且分配一个新的对象。  
* 但是`JSON.parse()`这个方法，只能够正确地处理 `Number`、`String`、`Array`等能够被`json`格式正确表达的数据结构。但是，`undefined`、`function`、`Symbol` 会在转换过程中被忽略。


### lodash.cloneDeep
在项目中我们要深拷贝一个复杂对象，首选的肯定是`lodash`的`cloneDeep`
 
```js
let obj = {a:1,b:'xxx'};
let copyObj =  JSON.parse(JSON.stringify(obj));
```
 
 使用方法很简单，源码的解读网上也有很多，这里就不赘述了，总体来说离不开以下几个关键点
 * ##### 所有类型的精确判断
 * ##### 基础类型的拷贝
 * ##### 复杂对象 - 可迭代对象的拷贝
 * ##### 复杂对象 - 函数、正则、日期等对象的拷贝
 * ##### 复杂类型的的原始构造器如何获取到
 * ##### 解决循环引用问题

### 手写实现
```js
// 判断是否复杂对象
const isComplexObj = data => {
    const type = typeof data
    return data !== null && (type === 'object' || type === 'function')
}

// 准确判断每一种对象的类型
function getType(target) {
    return Object.prototype.toString.call(target);
}


// 判断是否复杂类型，需要继续深入递归
const isIterative = data =>{
   let typeString = Object.prototype.toString.call(data);
   const iterateTypes = ['[object Array]', '[object Object]', '[object Map]', '[object Set]']
   return iterateTypes.includes(typeString)
}

// 获取一个一个复杂类型的原始值
const initComplexObj = data => {
    const creator = data.constructor
    return new creator() 
}

// 拷贝方法主函数
const deepCopy = function(target, currentMap = new WeakMap()) { // 使用WeakMap,使得currentMap与其内部属性是一个弱用关系，占用的内存不需要手动去释放
    // 处理原始类型
    if (!isComplexObj(target)) {
        return target  // 原始类型不做多余处理，直接进行返回
    }
 
    // 初始化复杂对象的初始值
    const cloneTarget = initComplexObj()

    // 检测当前复杂对象是否已经被拷贝过了
    if (currentMap.get(target)) {
      return currentMap.get(target)
    }
    // 使用WeakMap记录当前对象已经被处理了
    currentMap.set(target, cloneTarget) ;
 
    // 注意: 可遍历对象中，所有子元素的类型我们不清楚，所以要不断调用cloneDeep来确定，这里就触发了递归的点
    if (isIterative(target)) {
        // 复杂对象 - 可遍历对象 - Map的处理
        if (getType(target) === '[object Map]') {
            target.forEach((value, key) => {
              cloneTarget.set(key, deepCopy(value, currentMap))
            })
            return cloneTarget
        }
      
        // 复杂对象 - 可遍历对象 - Set 的处理
        if (getType(target) === '[object Set]') {
            target.forEach(value => {
              cloneTarget.add(deepCopy(value, currentMap))
            })
           return cloneTarget
        }   
    
        // 复杂对象 - 可遍历对象 - 数组、JS对象 的处理
        for (let attr in source) {
            cloneTarget[attr] = deepCopy(target[attr], currentMap); 
        }
        return cloneTarget;
    }
     else {
        // 复杂对象 - 不可遍历对象
        // Symbol  这个笔者认为是伪需求，拷贝出来的另一个Symbol又有何意义呢
        // Date 自己查查api吧，不难但是常见
        // RegExp 通过 source属性拿到正则的规则
        /** function  
         * 重点是要通过 func.prototype 去判断出是否箭头函数
         * 若是则使用 eval去生成即可
         * 若不是则通过正则解析出函数参数，通过new Function重新构造
         */
        // ....... 还有好多其他类型不多说了
        return cloneTarget
    }
}

```

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
[4] [如何写出一个惊艳面试官的深拷贝?](https://juejin.im/post/5d6aa4f96fb9a06b112ad5b1#heading-6)
