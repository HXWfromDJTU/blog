
/**
 * 工具函数库
 */
let utils = {
    realType:Object.prototype.toString.call
}

/**
 * 实现一个比较方法，最大可能性兼容所有的类型，并且要实现对象的比较。
 * @param {*} a 比较的第一个参数
 * @param {*} b 比较的第二个参数
 */
let equal = function(a,b){
   // 首先获取元素类型    
   let typeA = utils.realType(a);
   let typeB = utils.realType(b);

   if(typeA!==typeB) return false; 

   switch (typeA) {
       case '[object String]':
           
           break;
   
       default:
           break;
   }
}

