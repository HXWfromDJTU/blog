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
         this.cbQueue = [];
        // 用于传递的参数
        this.value = undefined;
        // 设定空函数，用于存放调用者为状态变化后的回调
        this.resolveFunc = function(){};
        this.rejectFunc = function(){};
        // 设置promise的初始状态为 pedning 
        this._status = 'pending';
        if(typeof fn === 'function'){
            try{
             // 执行构造时候 的 回调函数
             fn(this._resolve.bind(this),this._reject.bind(this))
            }catch(err){
                this.then(null,function(err){});
            }
        } 
        let self = this;

       return this;
      }
      // 注意这里的 _resolve 和 _reject是 Promise对象初始化的时候，用于决定promise状态的工具函数   
       _resolve(val){
           if(this._status!='pending') return; // 状态只能够由pending转移到 solved 
           this.value = val; // resovle时候传入的参数
           // 压入缓存队列等待执行  
           this.cbQueue.push({
               callback:this.resolveFunc,
               param:[this.value]
           });
           this._status = 'resolved';
       }
      
       _reject(val){
            if(this._status != 'pending') return; // 状态只能够由pending转移到 rejected
            this.value = val;
            // 压入缓存队列等待执行  
           this.cbQueue.push({
               callback:this.rejectFunc,
               param:[this.value]
           });
            this._status = 'rejected';
       }

       then(resolveFunc,rejectFunc){
             // 若用户有设置，则修改成功或者失败的回调函数
            this.resolveFunc = resolveFunc?resolveFunc:this.resolveFunc;
            this.rejectFunc = rejectFunc?rejectFunc:this.rejectFunc;
            // 若设置then解析的时候，状态还未改变，则只当传入回调函数，而不立即执行
            if(this._status=='pending') return this; 
            // 执行回调函数  
            let excuteCB = this.cbQueue[0].callback;
            let param = this.cbQueue[0].param;
            excuteCB.apply(null,...param);
            return this;
       }
}
```