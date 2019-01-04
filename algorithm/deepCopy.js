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
















let o2 = {
    abc:[345,456,123],
    qqq:{
        asd:123
    },
    test:'一般元素',
    fun:function(){
        console.log(this.test);
    }
}

let target = deepCopy({},o2);

console.log('刚拷贝好对象：',target);

target.abc.push(456);
target.qqq.asd = 456;
target.fun = function(){
    console.log('函数被我被修改了')
}

console.log('修改后的对象：',target);


console.log('原模板：',o2);
o2.fun();


let shallowCopy = (target,tempalte) =>{
    
}


module.exports = {
    deepCopy,

}
