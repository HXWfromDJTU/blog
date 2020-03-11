
let {equal} = require('./equal.js');
// 数组去重，重点在于判断两个变量是否相等

/**
 * 判断一个值在一个数组中是否已经出现过
 * @param {*} value 要校验的值 
 * @param {*} arr 要检测的范围数组  
 * @param {*} STRICT_LEVEL 表示才去的严格级别，1（默认）表示松校验仅仅使用 `===`判断，2表示严格校验，1、`1`、new String('1') 相等
 */
function hasAlready(value,arr,STRICT_LEVEL=1){
    // 
    if(STRICT_LEVEL==1){
       return (arr.indexOf(value) === -1);  // 使用数组的 indexOf Api
    }else{
        var flag = false;
        for(var i=0;i<arr.length;i++){
            // 判断是否有相等的
            if(equal(value,arr[i],'')){
                flag = true;
            }
        }
        return flag;
    }
}
/**
 * 数组去重模拟
 */
function unique(arr){
    if(Object.prototype.toString.call(arr) !== '[object Array]'){
         throw new Error('param must be an array~~');
     }
    if(arr.length<=1){return arr}; // 小于等于 1 的数组直接返回 
    var result = [];
    var current;
    // 遍历所有内容   
    for(var i=0;i<arr.length;i++){
        current = arr[i];
       // 判断是否已经装载过这个元素了   
       if(hasAlready(current,result,1)){
           result.push(current);
       }
    }
    return result;
}

