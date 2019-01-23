class MyPromise{
    constructor(fn){
        // 设定两种结果回调队列 
        this.resolveQueue = [];
        this.rejectQueue = [];
        this.message = null; // 用于传递状态改变时的消息，状态只会改变一次，所以共用此变量
        // 设定初始状态 
        this._status = 'PENDING';
        if(!typeof(fn)=='function'){throw Error('MyPromise 必须传递一个解析函数');return;}
        // 启动解析
        try{
           // 给用户的启动函数传入状态改变的方法
           fn(this._resolve.bind(this),this._reject.bind(this));
        }catch(err){
            this._reject(err);
        }
    }
    // 改变 为成功状态
    _resolve(data){
        if(this._status != 'PENDING') return this; // 状态只能够由 PENDING 出发
         this.message = data;
         this._status = 'RESOLVED';
         // 执行成功队列中的方法
         this.resolveQueue.forEach(cb=>{
             // 设定回调函数，并触发统一执行。
             this._excute(cb)
         });
         return this;
    }

     // 改变 为失败状态 
     _reject(err){
        if(this._status != 'PENDING') return this; // 状态只能够由 PENDING 出发
        this.message = err;
        this._status = 'REJECTED';
        // 执行失败队列中的方法  
        this.rejectQueue.forEach(cb=>{
            this._excute(cb)
        });
        return this;
     }
     // 对外开放的then方法
     then(resolveFunc,rejectFunc){
         let status = this._status;
         // 若状态已经决定，则直接执行用户设定的回调函数
        if(status=='RESOLVED'){
            this._excute(resolveFunc)
        }
        if(status=='REJECTED'){
            this._excute(rejectFunc)
        }
        // 若状态悬而未决，则先推入缓存队列，等待后续执行  
        if(status == 'PENDING'){
            this.resolveQueue.push(resolveFunc);
            this.rejectQueue.push(rejectFunc);
        }
        return this;
     }
     // 根据环境进行判断，使用不同的方式实现微任务  
     // 参考 Vue  this.$nexttick 的源码实现，使用策略退化的机制实现微任务的处理 
     _excute(cb){
        this._callback = cb;
        // 策略 1️⃣ 如果浏览器支持 MutationObserver
        if(typeof(MutationObserver)!='undefined'){
            this.targetNode = document.createElement('i');
            this.targetNode.id = 'INITIAL';
            // 配置所需检测对象
            let config = {
                attributes:true
            };
            // 声明 DOM 变动后触发的回调函数
            const mutationCallback = (mutationsList) => {
                for(let mutation of mutationsList) {
                    // mutation.type 指向的是 配置项中被修改的项目名称
                    if(mutation.type=='attributes'){
                        this._callback(this.message);
                    }
                }
            };
            // 使用构造器，初始实例化 MutationObserer对象
            let observer = new MutationObserver(mutationCallback);
            // 开启监听属性，传入监听DOM对象，和需要监听的内容
            observer.observe(this.targetNode, config);
            // 手动触发
            this.targetNode.id = this._status;
            return; // 拦截式
        }
        // 策略 2️⃣  若是node环境，则直接使用 nextTick实现微任务
        if(process){
           process.nextTick(_=>{
            this._callback(this.message);
           })
           return; // 拦截式
        }
        // 策略 3️⃣ 退化到使用 messageChannel（宏任务） 去实现 ，但是比一般的定时器优先级要高
        if(typeof(MessageChannel)!='undefined'){
            let mc = new MessageChannel();
            let port1 = mc.port1;
            let port2 = mc.port2;
            // 模拟一个传输过程，为了创建一个优先级比较高的宏任务
            port1.postMessage({});
            port2.onmessage(_=>{
                this._callback(this.message);
            })
            return ; // 拦截式 
        }
        // 策略 4️⃣ 最后退化到使用 setTimeout 去实现
        setTimeout(_=>{
            this._callback(this.message);
        },0)
        return;
     }
    }


// 其他常用 Api
MyPromise.resolve = data =>{
    let pro = new MyPromise(function(){})
    pro._resolve(data);
    return pro;
}
MyPromise.reject = err =>{
    let pro = new MyPromise(function(){})
    pro._reject(err);
    return pro;
}
/**
 * Promise.race
 */
MyPromise.race = promiseArr =>{
   // 用一个空的Promise函数来承载最后的状态
   let combinePro = new MyPromise(function(){})
   promiseArr.forEach(promise=>{
      if(!(promise instanceof MyPromise)) throw Error('必须传入MyPromise对象');
      let statusVal = promise._status;
      // 处理同步时，状态已经决定的Promise
      if(statusVal!='PENDING'){
          if(statusVal == 'RESOLVED'){
            combinePro._resolve(combinePro.message);
          }else{
            combinePro._reject(combinePro.message);
          }
        return;
      }
      Object.defineProperty(promise,'_status',{
          configurable:true,
          enumerable:true,
          get(){
              return statusVal;
          },
          set(newVal){
            statusVal = newVal;
            // 判断总的是否已经改变  
            if(combinePro._status!='PENDING') return;
            if(newVal=='RESOLVED'){
                combinePro.message = this.message;
                combinePro._resolve(combinePro.message);
            }else{
                combinePro.message = this.message;
                combinePro._reject(combinePro.message);
            }
          }
      })
   });
   return combinePro;
}

/**
 * Promise.race
 */
MyPromise.all = promiseArr =>{
    // 用一个空的Promise函数来承载最后的状态
    let combinePro = new MyPromise(function(){})
    let proNum = promiseArr.length;
    let count = 0;
    let messageMap = new Map();

    // 组装返回结果的方法
    function getMessage(){
       let messageArr = [];
       promiseArr.forEach(promise=>{
           // 从messageMap中使用promise对象，依次按照原顺序取出值
           messageArr.push(messageMap.get(promise))
       })
       return messageArr;
    }
    // 统一根据状态进行判断
    function handle(promise){
    let statusVal = promise._status;
   // 判断是否已经改变
   if(status=='RESOLVED'){
       messageMap.set(promise,this.message); // 不论先后，先存入map中
       count++;
    // 所有都resolved才能够，达到总体的resolved
    if(count==proNum){
      combinePro._resolve(getMessage())
    }
    }else{
        // 只要出现一个reject，则全部都rejected掉
        combinePro._reject(getMessage());
      }
    }
    // 遍历每一个promise进行不同处理
    promiseArr.forEach(promise=>{
       if(!(promise instanceof MyPromise)) throw Error('必须传入MyPromise对象');
       let statusVal = promise._status;
       // 对已同步完成的promise进行状态收集
       if(statusVal!='PENDING'){
          handle(promise)
          return; // 注意此处的return 仅为退出本轮
       }
       // 处理异步的peomise状态，则添加set监听
       Object.defineProperty(promise,'_status',{
           configurable:true,
           enumerable:true,
           get(){
               return statusVal;
           },
           set(newVal){
             statusVal = newVal;
             handle(promise);
           }
       })
    });
    return combinePro;
 }


//  测试
let pro  = new MyPromise(function(resolve,reject){
    setTimeout(function(){
        resolve('asd');
    },99)
})

pro.then(function(data){
   console.log(data);
})

console.log(123)