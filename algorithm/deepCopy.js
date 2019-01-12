// 判断是否复杂类型，需要继续深入递归
let isComplex = data =>{
   let str = Object.prototype.toString.call(data);
   let dict = {
       '[object Array]':true,
       '[object Object]':true
   };
   if(dict[str]){
       return true;
   }else{
       return false;
   }
}


/**
 *  其他疑问  
 * 1 循环引用  
 * 2 引用丢失   
 * 3 使用递归，调用栈溢出  
 *  
 */


let deepCopy = function(target,source){
    let stack = [];// 使用一个数组作为调用栈，系统的调用栈，避免递归栈限制
    // 使用一个WeakMap存储已经拷贝过的对象
    let currentMap = new Map();
    for(let attr in source){
        if(isComplex(source[attr])){
            let hasAlready = currentMap.has(source[attr]); // 判断之前是否已经拷贝过一次 
            if(hasAlready){
                target[attr] = source[attr]; // 若已经拷贝过，则将原来拷贝的一份取出来(也包括嵌套的问题，因为不再取去拷贝了)  
            }else{  
                let result = deepCopy(source[attr]); 
                currentMap.set(result,result); // 存储
                target[attr] = result; 
            }
        }else{
            target[attr] = source[attr];
        }
    }
    return target;
}

let o1 = {
    key:70890
}
let o2 = {
    abc:[345,456,123],
    qqq:{
        asd:123
    },
    test:'一般元素',
    fun:function(){
        console.log(this.test);
    },
    dupTest1:o1,
    dupTest2:o1
}

let target = deepCopy({},o2);

console.log(target)
target.dupTest1.key = 123;
console.log(target)




// module.exports = {
//     deepCopy,

// }
