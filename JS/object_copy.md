# 对象和数组的拷贝
___
## 浅拷贝
使用直接赋值的方式，我们得到的效果一般就是浅拷贝，因为复制的只是对象和数组的引用地址。
___ 
## 伪深拷贝

#### 数组分割与合并
* 常用方法：`array.slice(0)` 和 `array.concat()`
只对数组进行了第一层的完全拷贝，第二层以及内部若存在对象或者数组，则也都只是复制了对象的引用。

#### Object.assign
* 常用方法：`Object.assign`
Object.assign拷贝的是属性值，假如源对象对属性是一个指向对象的引用，也只会拷贝那个对象的引用值。

#### ...展开运算符
实现的效果仍然是首层内容的完全拷贝，对于第二层及以后都是只复制引用地址。

只复制第一层的拷贝，适用于只有单层内容(数组或者对象)的拷贝，速度快，不需要迭代。

___
## 深拷贝
> 深拷贝是要对对象以及对象的所有子对象进行拷贝。

####  强转换
使用`JSON.stringfy() + JSON.parse`进行转换
* 将数据转换成一个字符串，然后再使用`JSON.parse`转换为`JSON`对象，并且分配一个新的对象。
* 但是`JSON.parse()`这个方法，只能够正确地处理 `Number`、`String`、`Array`等能够被`json`格式正确表达的数据结构。但是，`undefined`、`function`、`symbol` 会在转换过程中被忽略。
   ```js
   let obj = {a:1,b:'xxx'};
   let copyObj =  JSON.parse(JSON.srtingfy(obj));
   ```

## 遍历转换
 遍历对象上的所有属性，实现深度拷贝
```js
  function deepCopy(source){
    let target;
    if( typeof source === 'object'){
          // 判断传入的值是否为数组，若为数组，则初始化为一个空数组，否则初始化为一个空对象
          target =  Array.isArray(source) ? [] : {}; 
          // 遍历数组元素
          for(let key in souce){
              // 要判断这个key值对应的内容是对象上的属性，而不是对象继承下来的属性
              if(source.hasOwnProperty(key)){
                  // 判断当前对象是否还是对象或者数组....若不是则可以直接拷贝给新的对象。若是数组或对象，则进行递归遍历
                   if(typeof source[key] !== 'object'){
                       target[key]  = source[key]
                   }else{
                       target[key]  =  deepCopy(source[key])
                   }
              }
          }
    }else{
        // 若拷贝的目标，不是对象，则直接进行拷贝
        target  = source
    }
    retrun target;
  }
```







参考资料：http://t.cn/Rucl0qE
