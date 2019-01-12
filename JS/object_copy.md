# 对象和数组的拷贝

## 复制引用
使用直接赋值的方式，我们得到的效果一般就是浅拷贝，因为复制的只是对象和数组的引用地址。
```js
let a = {key:123};
let b = a;
b; // {key:123}
a === b; // true
```
___ 
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

___
## 深拷贝
> 深拷贝是要对对象以及对象的所有子对象进行拷贝。

####  强转换
使用`JSON.stringfy() + JSON.parse`进行转换
1️⃣ 将数据转换成一个字符串，然后再使用`JSON.parse`转换为`JSON`对象，并且分配一个新的对象。  
2️⃣ 但是`JSON.parse()`这个方法，只能够正确地处理 `Number`、`String`、`Array`等能够被`json`格式正确表达的数据结构。但是，`undefined`、`function`、`Symbol` 会在转换过程中被忽略。
   ```js
   let obj = {a:1,b:'xxx'};
   let copyObj =  JSON.parse(JSON.srtingfy(obj));
   ```

## 遍历转换
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
 *  
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
                let result = deepCopy(source[attr]); 
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





___

参考资料：http://t.cn/Rucl0qE
