/**
 * 使用 ECMAScript（JS）代码实现一个事件类Event，包含下面功能：绑定事件、解绑事件和派发事件。
 */


 class Event{
     constructor(){
         // 使用图的数据结构去查找
         this._cache = {};
     }
     // on方法用于绑定事件。
     listen(eventName,callback){
         if(!this._cache[eventName]){
             this._cache[eventName] = [callback]
         }else{
             this._cache[eventName].push(callback);
         }
         return;
     }
     // 用于触发事件
     trigger(eventName,param){
         // 取出事件依赖集合
         let fns = this._cache[eventName];
         // 拦截式退出
         if(!fns || !fns.length) return;
         // 循环执行依赖事件
         for(let fn of fns){
             try{
                 fn(param);
             }catch(err){
                  console.log(err);
             }
         }
     }
     // 取消事件,需要指明某个依赖的清除
     off(eventName,callback){
        let fns = this._cache[eventName]; // 取出事件集合 
        // 若不指定依赖，则取消所有事件。
        if(!callback){
            this._cache[eventName] = null;
            return;
        }
        let index = fns.indexOf(callback); //找出该依赖所在位置 
        if(!fns || !fns.length) return; // 排除依赖为空的情况  
        if(index == -1)  return; // 无该事件依赖  
        fns.splice(index,1);
        this._cache[eventName] = fns;
     }
 }

 let event  =  new Event();
let callback1 = function(data){
    console.log('christmas-egg-bug lol:'+data);
};

let callback2  = function(data){
    console.log('many-people-in-('+ data+')-lost-job')
}
 event.listen('christmas-egg-explore',callback1)

 event.trigger('christmas-egg-explore','Alibaba');


 event.listen('christmas-egg-explore',function(data){
     console.log('other-company-cry-to-die:')
 })


 event.listen('cut-hc',callback2)
 // 测试事件触发
 event.trigger('christmas-egg-explore','AntDesign');
 event.trigger('cut-hc','DiDi');

 //测试事件取消 
 event.off('christmas-egg-explore',callback1);

 event.off('cut-hc',callback2);

 event.trigger('cut-hc','MeiTuan');
 event.trigger('christmas-egg-explore','AntDesign');