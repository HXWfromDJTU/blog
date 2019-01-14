## Promise A+ 规范与 手工实现  


#### 简述
1️⃣ Promise是一个容器  
2️⃣ 

#### Step 1
没有头绪？我们可以根据现有的调用情况来看看，一步步来
![](/blog_assets/Promise_Design.png)

```js
/**
 * 实现一个简单的Promise   
 * 
 */


class MyPromise{
     constructor(fn){
        // 用于传递的参数
        this.value = undefined;
        // 设定空函数，用于存放调用者为状态变化后的回调
        this.resolveFunc = function(){};
        this.rejectFunc = function(){};
        // 设置promise的初始状态为 pedning 
        this.status = 'pending';
        if(typeof fn === 'function'){
            try{
             // 执行构造时候 的 回调函数
             fn(this._resolve.bind(this),this._reject.bind(this))
            }catch(err){
                this.then(null,function(err){})
            }
        } 
       return this;
      }
      // 注意这里的 _resolve 和 _reject是 Promise对象初始化的时候，用于决定promise状态的工具函数   
       _resolve(val){
           if(this.status!='pending') return; // 状态只能够由pending转移到 solved 或者 rejected
           this.value = val; // resovle时候传入的参数  
           let timer = setTimeout(function(){
               pro.resolveFunc(this.value);
           },0);
           this.status = 'resolved';
       }
    
       _reject(val){
            if(this.status != 'pending') return; 
            this.value = val;
            let timer = setTimeout(function(){
                  pro.rejctFunc(this.val); // 异步调用 then方法中设置的回调
            },0)
            this.status = 'rejected';
       }

       then(resolveFunc,rejctFunc){
            this.resolveFunc = resolveFunc;
            this.rejectFunc = rejectFunc;
       }
}
```