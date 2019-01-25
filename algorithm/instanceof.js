/**
 * intanceOf 模拟实现 instanceof 运算符   
 * @param {*} a  要检测的对象
 * @param {*} b  要追溯的原型
 */
function  instanceOf(a,b){
    var type = typeof(a);
   if( (type!= 'object' && type != 'function') || a == null ) return false; // 非对象或者函数类型，直接返回false
   if(b===Object) return true; // 若是Object顶级，则直接返回true

   var proto = Object.getPrototypeOf(a); // Object.getPrototypeOf 若不支持，则使用 .__proto__ 的形式进行原型链追溯
   var flag = false;    
   //  直到找到原型链的顶端
   while(proto!==Object.prototype){
     if(proto===b.prototype){
           // 若找到了则跳出循环
          flag=true;
           break;
     }else{
           // 不断沿着原型链向上寻找
           proto = Object.getPrototypeOf(proto)
     }
   }  
 // 返回结果
 return flag;
}


// Test Case   
let fun = function(){};
let obj = {};

class Person{} 
class Man extends Person{} 
let Tony = new Man();  

let construct = [
    instanceOf(fun,Function),
    instanceOf(fun,Object),
    instanceOf(obj,Object),
    instanceOf(obj,Function),
    instanceOf(Tony,Man),
    instanceOf(Tony,Person)
]
construct.forEach(res=>{
    console.log(res)
})
/**
true
true
true
false
true
true
 */
