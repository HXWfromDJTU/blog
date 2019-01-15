

class MyPromise{
    constructor(fn){
        // 设定两种结果回调队列 
        this.resolveQueue = [];
        this.rejectQueue = [];
        this.message = null; // 用于传递状态改变时的消息，状态只会改变一次，所以共用此变量
        // 设定初始状态 
        this._status = 'PENDING';
        try{
           // 给用户的启动函数传入状态改变的方法
           fn(this._resolve.bind(this),this._reject.bind(this));
        }catch(err){
            this._reject(err);
        }
    }
    // 改变 为成功状态
    _resolve(data){
         this.message = data;
         this._status = 'RESOLVED';
         this._callback = function(){}
         // 执行成功队列中的方法
         this.resolveQueue.forEach(cb=>{
             // 设定回调函数，并触发统一执行。
             this._excute(cb)
         })
    }

     // 改变 失败状态 
     _reject(err){
        this.message = err;
        this._status = 'REJECTED';
        // 执行失败队列中的方法  
        this.rejectQueue.forEach(cb=>{
            this._excute(cb)
        })
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
                    let type = mutation.type;
                    switch (type) {
                        case "attributes":
                            this._callback(this.message);
                            break;
                        default:
                            break;
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
let pro  = new MyPromise(function(resolve,reject){
    setTimeout(function(){
        resolve('asd');
    },99)
})

pro.then(function(data){
   console.log(data);
})

console.log(123)