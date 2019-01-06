// 判断是否复杂类型，需要继续深入递归
let isComplex = data =>{
   let str = Object.prototype.toString.call(data);
   let dict = {
       '[Object Array]':true,
       '[Object Object]':true
   };
   if(dict[str]){
       return true;
   }else{
       return false;
   }
}
/**
 * 
 * @param {*} obj1 拷贝目标输出对象
 * @param {*} obj2 拷贝模板对象
 */
let deepCopy = (obj1,obj2) =>{
    for(let attr in obj2){ // 注意此处不可以使用 for of遍历，因JS对象并没有遍历器接口 
        if(isComplex(obj2[attr])){
           deepCopy(obj2);
        }else{
             obj1[attr] = obj2[attr]
        }
    }
    return obj1;
}

/**
 *  其他疑问  
 * 1 循环引用  
 * 2 引用丢失   
 * 3 使用递归，调用栈溢出  
 *  */

// let template = {
//     abc:{
//         qqq:456
//     }
// }
// template.abc.qqq = template;

// let b = deepCopy({},template);
// console.log(b);

deepCopy = function(target,source){
    let stack = [];// 使用一个数组作为调用栈，系统的调用栈，避免递归栈限制
    // 使用一个WeakMap存储已经拷贝过的对象
    let currentSet = new WeakMap();
    for(let attr in source){
        if(isComplex(source[attr])){
            let hasAlready = currentSet.has(source[attr]); // 判断之前是否已经拷贝过一次 
            if(hasAlready){
                target[arrt] = currentSet.get(source[attr]); // 若已经拷贝过，则将原来拷贝的一份取出来(也包括嵌套的问题，因为不再取去拷贝了)
            }else{
                stack.push(source[attr]); // 收纳每一个需要遍历的数据 （相当于收集了第一层的入口）
            }
        }else{
            target[attr] = source;
        }
    }

    // while(){

    // }


    return target;
}












// let o2 = {
//     abc:[345,456,123],
//     qqq:{
//         asd:123
//     },
//     test:'一般元素',
//     fun:function(){
//         console.log(this.test);
//     }
// }

// let target = deepCopy({},o2);

// console.log('刚拷贝好对象：',target);

// target.abc.push(456);
// target.qqq.asd = 456;
// target.fun = function(){
//     console.log('函数被我被修改了')
// }

// console.log('修改后的对象：',target);


// console.log('原模板：',o2);
// o2.fun();


// let shallowCopy = (target,tempalte) =>{
    
// }


// module.exports = {
//     deepCopy,

// }
