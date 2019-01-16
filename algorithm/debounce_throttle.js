// 节流与防抖的一个最大的区别，事件的频繁触发，防抖策略下会不断推迟事件的真正执行事件，最后只执行一次。而节流是会在固定的时间，执行一次。
// 防抖通过不断清除当前定时器，再设置新的定时器来实现。  
// 节流的核心思想是在一个周期内，合并多次函数操作。（不需要考虑跨周期的时间)
// 防抖
/**
 * debounce
 * 非立即执行
 */
function debounce(fun,delay){
     return function(...args){
         let _args = args;
         let that = this;
         clearTimeout(fun.timerId);
         // 定时器的ID绑定在原函数的静态属性上   
         fun.timerId = setTimeout(function(){
             fun.apply(that,args);
         },delay)
     }
}
/**
 * debounce
 * 添加首次立即执行可控的综合版本   
 */
function debounce(fun,delay,callNow){
    return function(...args){
        let _args = args;
        let that = this;
        clearTimeout(fun.timerId);
        // 立即执行
        if(!fun.timerId && callNow){
            fun.apply(that,_args);
            fun.timerId ='INITIAL'; 
            return;
        }
        // 定时器的ID绑定在原函数的静态属性上   
        fun.timerId = setTimeout(function(){
            fun.apply(that,args);
            fun.timerId = null; // 执行完后，要将timerId重新置空
        },delay)
    }
}


 // 节流 
/**
 * throttle
 * @param {* Function} fun    被包装的函数
 * @param {* Number} period 函数触发的周期(秒)
 */

function throttle(fun,period){
    let lastTime = (new Date().getTime()); // 获取初始执时间
    return function(...args){
          let that = this; // 保存上下文    
          let _args = args; // 保存参数列表   
          let now = (new Date()).getTime();
          // 没到周期时间
          if(period>now-lastTime){
              return;
          }
          lastTime = (new Date()).getTime(); // 更新周期开始时间
          fun.timerId =  setTimeout(() => {
              fun.apply(that,args);
          },period)
    }
}
/**
 * 节流综合版本
 * @param {*} fun     被包装函数  
 * @param {*} period  执行周期  
 * @param {*} callNow 是否立即执行   
 */

function throttle(fun,period,callNow){
    let lastTime = 0; // 初始化时间
    return function(...args){
          let that = this; // 保存上下文    
          let _args = args; // 保存参数列表 
           // 计算当前时间
           let now = (new Date()).getTime();
           let remaining = period- (now-lastTime); // 得到触发时间剩余的时间
        
          
           // 首次立即执行 
           if( (!fun.timerId || remaining<0) && callNow){  // fun.timerId控制是否首次进入，而remaining<0控制是否后续的首次进入
            lastTime = (new Date()).getTime();  // 更新上次执行时间
            fun.apply(that,_args);
            fun.timerId = 'INITIAL'; // 设定为已被初始过
            return;
           } 

           if(fun.timerId>0) clearTimeout(fun.timerId); // 因为上一次的定时器还存在,清除之前的，然后重新用remaining设置一个新的 

           // 在冷却周期内，只是会设定定时器
           fun.timerId =  setTimeout(() => {
               lastTime = (new Date()).getTime(); // 定时任务被触发，更新上次触发时间
               fun.apply(that,args);
           },remaining)

    }
}

/**
 * 添加首次
 */