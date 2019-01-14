class MyPromise{
    constructor(fn){
        this.cbQueue = [];
       // 用于传递的参数
       this.value = undefined;
       // 设定空函数，用于存放调用者为状态变化后的回调
       this.resolveFunc = function(){};
       this.rejectFunc = function(){};
       let status = this._status;
       // 设置promise的初始状态为 pedning 
       Object.defineProperty(this,'_status',{
          configurable:true,
          enumerable:true,
            get(){
              return status;
            },
           set(newVal){
               status = newVal;
               // 判断状态变化
               let callback;
               if(newVal=='pending') return;
               if(newVal=='resolved'){
                   callback = this.resolveFunc;
                }else{
                    callback = this.rejectFunc;
                }
                // 压入缓存队列等待执行  
                this.cbQueue.push({
                    callback:callback,
                    param:[this.value]
                });
            }
        })
        this._status = 'pending';
       if(typeof fn === 'function'){
           try{
            // 执行构造时候 的 回调函数
            fn(this._resolve.bind(this),this._reject.bind(this))
           }catch(err){
               this.then(null,function(err){});
           }
       } 


      return this;
     }
     // 注意这里的 _resolve 和 _reject是 Promise对象初始化的时候，用于决定promise状态的工具函数   
      _resolve(val){
          if(this._status!='pending' && this._status!=undefined ) return; // 状态只能够由pending转移到 solved 
          this.value = val; // resovle时候传入的参数
          this._status = 'resolved';
      }
     
      _reject(val){
         if(this._status != 'pending' && this._status!=undefined ) return; // 状态只能够由pending转移到 rejected
           this.value = val;
           this._status = 'rejected';
      }

      then(resolveFunc,rejectFunc){
            // 若用户有设置，则修改成功或者失败的回调函数
           this.resolveFunc = resolveFunc?resolveFunc:this.resolveFunc;
           this.rejectFunc = rejectFunc?rejectFunc:this.rejectFunc;
           // 若设置then解析的时候，状态还未改变，则只当传入回调函数，而不立即执行
           if(this._status=='pending') return this;    
           let excuteCB = this.cbQueue[0].callback;
           // 重新覆盖压栈的函数 
           if(this._status == 'resolved'){
               excuteCB = this.resolveFunc;
           }else{
               excuteCB = this.rejectFunc;
           }
           let param = this.cbQueue[0].param;
           excuteCB.apply(null,param);
           return this;
      }
}


let pro  = new MyPromise(function(resolve,reject){
    resolve('asd');
})

pro.then(function(data){
      console.log(data);
})