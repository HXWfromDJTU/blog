# 对象和数组的存储机制
### ---从深浅拷贝对象和拷贝数组的方法说起

## 浅拷贝

### 数组浅拷贝
* 常用方法：`array.slice(0)`  `array.concat()`

### 对象的浅拷贝
* 常用方法：`Object.assign`

### 深拷贝
> 深拷贝是要对对象以及对象的所有子对象进行拷贝。

####  `JSON.stringfy() + JSON.parse`
* 将数据转换成一个字符串，然后再使用`JSON.parse`转换为`JSON`对象，并且分配一个新的对象。
* 但是`JSON.parse()`这个方法，只能够正确地处理 `Number`、`String`、`Array`等能够被`json`格式正确表达的数据结构。类似于`Function`这样不能够被`json`表示的数据，则不能够被正确处理。
   ```js
   let obj = {a:1,b:'xxx'};
   let copyObj =  JSON.parse(JSON.srtingfy(obj));
   ```

#### 遍历对象上的所有属性，实现深度拷贝
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
                       target[key]  =  enxted(source[key])
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
