
/**
 *  ES3 版本
 *  使用原生JS实现一个apply函数
 *  myApply  
 *  @param {*} context 改为指向的指向上下文
 *  @param {*} arr 传入的参数列表
 */
Function.prototype.myApply = function(context,arr){
    let that = context?context:window; // 当传入的指向为null或者undefiend的时候，默认指向window
    if(typeof(this)!='function'){
        throw new Error('myApply must be called by function....')
    }
    if(!(arr instanceof Array)){
        throw new Error('the second param of myApply must be ArrayLike...')
    }
    let argArr = [];
    for(let i=0;i<arr.length;i++){
        argArr.push('arr['+i+']'); // 将引用存入，注意不是存入值
    }
    // 获取随机字符串作为临时key
    let tmpKey = utils.getRandomString(5);
   /* 
    * call和apply的 <核心> 
    * 在要指向的对象 context 上属性上挂载原方法，
    * 则原方法内的this自然就临时指向了传入的context
    */
    that.tmpKey = this; 
    
    let str = 'that.tmpKey('+argArr.join(',') +')';
    let result;
     result = eval(str);
     delete that.tmpKey; //删除临时属性
     return result;
 }
/**
 * myCall
 * 使用ES3 语法实现call 
 */

Function.prototype.myCall = function(context){
    let that = context?context:Object(context);
    if(typeof(this)!='function'){
        throw new Error('myCall mu be called by a function!!!');
    }
 
    that.tmpKey = this; // 使得调用者成为改变后this对象的一个属性，则调用者的内部this自然指向被调用者
     
     // 拼装参数
     let argArr = [];
     for(let i=1;i<arguments.length;i++){
         argArr.push('arguments['+i+']'); // 将引用存入，注意不是存入值
     }
 
     // 执行拼装后的函数  
     let strFun = 'that.tmpKey('+ argArr.join(',') +');'
     let result = eval(strFun);
     delete that.tmpKey; // 删掉临时属性
     return result;
 }

/**
 *  *** 注意 本方法用到了同目录下的 
 *  ES3 实现一个bind函数
 *  myBind  
 *  @param {*} context 
 */
Function.prototype.myBind = function(context){
    let caller = this; // 调用者  
    let that  = context?context:Object(context);  // 要指向的对象   
    if(typeof(caller) != 'function'){
         throw new Error('只能对 Function 进行 myBind 操作');
         return;
    }
    // 使用 myCall 取出参数值 
    let argArr = Array.prototype.slice.myCall(arguments,1);
    let Fun = function(){}; // 临时虚拟原型
    Fun.prototype = caller.prototype;
    // 判断当前是否使用 new 操作符
    let isNew = caller instanceof Fun;
    let resFun = function(){
        // 合并参数  
        let argRest = Array.prototype.slice.myCall(arguments,0);   
        let finalArgs = argArr.concat(argRest);     
        // 使用前面定义的 myApply 改变 this 指向  , 若是使用了 new 操作符则传原来的this
        caller.myApply(isNew?caller:that,finalArgs);
    }
    // 考虑到一个函数还有可能被作为函数的一个构造器，被 new 执行
     resFun.prototype = Fun.prototype;
     resFun.prototype.constructor = resFun;

    return resFun;
}




let utils = {
    getRandomString:function(len){
        // 常用字符库
        let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ12345'; 
        let result = '';
        for(let i=0;i<len;i++){
             let key = (Math.random().toFixed(1)*10)+(Math.random().toFixed(1)*10)+(Math.random().toFixed(1)*10);
             result+= str[key];
        }
        return result;
    }
}

