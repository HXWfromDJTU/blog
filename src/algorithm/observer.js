/**
 * 实现一个简单的观察者模式
 * 分析：
 * 在javascript中，事件回调机制，本来就是一个天生的观察者模型，所以我们在模拟观察者模式的时候，
 * 可以改变想法去编写一个事件管理器，eventEmitter
 */

 function MyEventEmitter(){
     this.eventMap = {};
 }

// 事件监听
 MyEventEmitter.prototype.listen = function(target,type,callback){
     MyEventEmitter.checkType(type) // 拦截式检验
     var callbacks = this.eventMap[type]
     if(callbacks){
        callbacks.push(callback); // 
     }else{
        callbacks = [callback]; // 首次放入
     };
     this.eventMap[type] = callbacks;
 }

 // 事件触发  
MyEventEmitter.prototype.trigger = function(type){
    MyEventEmitter.checkType(type) // 拦截式检验
    var callbacks = this.eventMap[type]; // 取出事件对应的回调   
   if(callbacks){
       callbacks.forEach(cb => {
           cb(); // 遍历执行所有订阅者的回调
       });
   }
}
/**
 * 注销事件
 * @param {*} type 事件名称
 * @param {*} [...callbacks] 要注销的回调（可选,可以依次传入多个）
 */
MyEventEmitter.prototype.off = function(type){
    MyEventEmitter.checkType(type); // 检验事件名称是否为字符串     
    var offCallbacks = Array.prototype.slice.call(arguments,1); // 取出后面所有的参数
    var callbacks =  this.eventMap[type];
    // 事件没有注册过
    if(!callbacks) return;
    // 若没有传入要注销的事件，默认注销所有监听，清空事件监听队列
    if(!offCallbacks.length){
        this.eventMap[type] = []; 
        return;
    }
   
     // 逐个清出事件注册队列    
     offCallbacks.forEach(offCB=>{
        var index = callbacks.indexOf(offCB); // 检测对应事件监听是否有这个回调   
        if(index !== -1){
            this.eventMap[type].splice(index,1); // 移除对应的事件
        }    
     })
    
}


// 检验事件名称是否合法
MyEventEmitter.checkType = function(type){
    if(typeof(type) !== 'string') throw new Error('事件名称必须为一个字符出串...');
    return true;
}



// TEST CASE   
let MET = new MyEventEmitter();
var turnHot = function(){
        console.log('ho hot hot');
}
MET.listen({},'weather-turn-hot',turnHot)

MET.trigger('weather-turn-hot');

MET.off('weather-turn-hot',turnHot);

MET.trigger('weather-turn-hot');