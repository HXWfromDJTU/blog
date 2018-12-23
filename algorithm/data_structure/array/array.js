/**
 * ArrayList
 * @description 模拟的是原始的数组，没有数据类型的区分
 */
class ArrayList{
    constructor(size,dataSize){
        // 初始化数组属性
        this.head = null;
        this.length = 0;
        this.dataSize = dataSize || 1;
    }
    // 数组尾部加入元素
    push(value){
       let head = this.head;
       let length = this.length;
       let newNode  = null;
       // 若数组为空
       if(this.length == 0){
        // 头元素指针指向新元素
        this.head = [value];
         // 长度累加
        this.length++;
        return this.head;
       }
       // 其他情况
       let index = this.length;
       this.head[index] = value;
       // 长度累加
       this.length++;
    }
    // 数组尾部删除一个元素
    pop(){
        let lastIndex =  this.length-1;
        let value = this.head[lastIndex];
        this.head[lastIndex] = null;
        return value;
    }
    // 数组头部添加一个元素
    unshift(value){
       
    }
    // 数组头部删除一个元素
    shift(){
      
    }
    // 根据值获取下标（有多个只找到第一个）
    indexOf(value){
        let index = 0;
        // 当元素存在的时候
        while(this.head[index]){
            if(this.head[index] == value){
                return index;
            }
            // 下标累加
            index++;
        }
        // 没有找到的情况
        return undefined;
    }
    show(){
        for(let item of this){
            console.log(item)
        }
    }
}
ArrayList.prototype[Symbol.iterator] = function *(){
    let i =0 ;
    while(i<this.length){
        let value = this.head[i];
        if(value!=undefined && value!=null){
            yield this.head[i];
        }
       i++;
    }
}

module.exports = {
    ArrayList
}