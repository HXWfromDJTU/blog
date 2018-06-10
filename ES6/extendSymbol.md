# 拓展运算符

### 序列化/分解数组
* 拓展运算符有

### 可不服替代apply的用法，将数组中元素，逐个传给所要接收的对象

### 用于深度拷贝数组、拷贝对象
```js
   let aObj = {};
   let bObj = {
       a:123,
       b:(param)=>{
           console.log(param)
       },
       c:[123,'456',()=>{
           console.log('function inner array')
       }],
       d:{
           key1:123,
           key2:[123,456,789]
       }
   }
   aObj = {...bObj};
   aObj.a; // 123
   aObj.c[2](); // 'function inner array'
   aObj.d.key2[2]; // 789
```

### 合并数组
```js
let aArray = [123,456,789];
let bArray = ["abc","efg"]; 
let cArray = [{key1:123,key2:456}];
let combine = [...aArray,...bArray,...,cArray]; // 相当于  aArray.concat(bArray).concat(cArray)
```