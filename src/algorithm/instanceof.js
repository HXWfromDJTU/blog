
function _isLeagal(obj){
    var type = typeof(obj);
    // 非对象或者函数类型，直接抛出错误
    if( (type == 'object' && obj != null)  || type == 'function') return true;
}
/**
 * intanceOf 模拟实现 instanceof 运算符
 * @param {*} a  要检测的对象
 * @param {*} b  要追溯的原型
 */
function  instanceOf(a,b){
   // 检验参数合法性

   if(!_isLeagal(b)){throw new Error('the second param of instanceof must be an object');}

   if(!_isLeagal(a)){return false};

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



/**
 * new 关键字模拟
 * @param {*} fun 要实例化的构造器
 */
function New(fun){
    if(typeof(fun) !== 'function'){throw new Error('new 操作必须作用于一个构造器上')};
    return function(){
        var o = {}                           //创建临时对象
        o.__proto__ = fun.prototype;         // 将父类的作用域赋值给新对象
        fun.apply(o,arguments);                //用新的参数，继承父类的属性，调用父类的构造器，生成新的属性
        return o;                            //返回新对象
    }
}


// 作为 ES5 之前 Object.create 的替代函数
/**
 * 模拟 Object.create 方法
 * @param {*} obj
 */
Object.prototype.create = Object.prototype.create || function(obj){
    var fun = function(){}; // 设置一个空的构造函数
    fun.prototype = obj; // 空类的原型指向要拷贝的对象
    return new fun(); // 返回一个对象的实例，因为构造函数是空的，所以对obj上的属性肯定没有修改，达到了拷贝的目的
}


/**
 * 模拟继承函数
 * @param {*} subClass 子类构造器
 * @param {*} superClass 父类构造器
 */
function Extend(subClass,superClass){
    if(typeof(subClass)!=='function' || typeof(superClass)!=='function'){
        throw new Error('extend操作必须作用在两个构造器之间');
    }
    var proto = Object.create(superClass.prototype);// 拷贝父类原型
    proto.constructor  = subClass; // 对象增加，修改该原型对应的构造器
    subClass.prototype = proto; // 赋值给子类原型
}

/**
 * 模拟实现 assign方法
 * @param {*} target 目标元素
 * @param {*} source 一个或者多个source对象
 */
Object.assign = Object.assign || function(target){
    // 取出要合并的对象
    for(var i=1;i<arguments.length;i++){
        var obj = arguments[i];
        var keyArr =  Object.keys(obj);
        for(var j = 0;j<keyArr.length;j++){
           target[keyArr[i]] =  obj[keyArr[i]]; // 后续属性值，覆盖前一个的属性值
        }
    }
  return target;
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
