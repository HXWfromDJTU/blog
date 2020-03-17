## 一些老生常谈但不除根的问题

Object.create 的内部实现是这样的
```js
fucntion(obj){
    fucntion F(){};  //声明一个空函数（构造器）
    F.prototype = obj;  // 给这个构造器添加上原型，指向传入的obj，也就是F类型上所有的属性都来自于 obj
    return new F(); // 用这个临时类型创建一个实例，并且返回
}
```

instance_of的原理
```js
function(L,R){
    var O = R.prototype;
    L= L.__proto__;
    while(true){
        if(L===null)   // 若已经搜索到了原型链条顶端
          return false;
        if(O===L)    //  若L在圆形链往上找，在某一个层级找到了R的原型，说明L 和R在一条原型链上
           return true;
        L = L.__proto__;  // 推动 L不断原型链向上查找
    }
}
```