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

// 递归形式实现，已完成 除了递归过深，其他没有大问题   
let deepCopy = function(target,source){
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

/**
 * 使用层序遍历，修改为非递归形式的深拷贝 
 * @param {*} 要拷贝的数据 
 */


function deepCopy2(data){
    let obj = {};
    let originQueue = [data];
    let copyQueue = [obj];
    // 使用 Map来保存已经拷贝过的对象
    let hasCopyMap = new Map();
    while(originQueue.length > 0){
        var _data = originQueue.shift();
        var _obj = copyQueue.shift();
        for(var key in _data){
            var _value = _data[key]
            if(!isComplex(_value)){
                _obj[key] = _value;
            } else {
                // 若已经存在，则直接从Map中取出   
                let hasAlready =  hasCopyMap.has(_value); 
                if(hasAlready){
                    // 出现环的情况不需要再取出遍历
                    _obj[key] = hasCopyMap.get(_value);
                } else {
                    hasCopyMap.set(_value,_value);
                    originQueue.push(_value);
                    _obj[key] = Array.isArray(_value)?[]:{};  // 保留住本层的key，并且新建一个空对象 / 数组 作为值
                    copyQueue.push(_obj[key]);
                }
            }
        }
    }
    return obj;
  }





let o1 = {
    key:70890
}
let o2;
o2 = {
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
o2.dupTest3 = o2;
o2.dupTest1.key = 888;

let target = deepCopy2(o2);


console.log(target)



