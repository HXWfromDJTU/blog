/**
 * 数组的拍平
 * @param {*} arr 需要进行拍平的数组
 */
function flatten(array){
     let arr =array;
     let len = arr.length; // 数组长度

     let result = [];
     
     for(let i=0;i<len;i++){
         if(Array.isArray(arr[i])){
             result =  result.concat(flatten(arr[i])); // 当前的结果和内层的结果结合  
         }else{
             result.push(arr[i]);
         }
     }
     return result;
}