/**
 * @author SwainWong
 */
class Stack{
  constructor(size){
      this.length = 0;
      this.head = []; // 空栈
      this.size = size; // 最大的大小
  }
  // 出栈
  pop(){
    if(this.length==0){
        console.log('哇啊...栈内已经没有元素啦..别pop啦');
        return false;
    }
    let head = this.head;
    //TODO:此处缺少对引用类型数据的兼容，引用类型需要拷贝对象
    let value = head[this.length-1];
    // 移除元素
    this.head[this.length-1] = null;
    this.length--;
    // 若这个元素已经被置空了，那就继续寻找下一个元素
    if(!this.validate(value)){
        this.pop();
    }
    this.log()
    return value;
  }
  // 入栈
  push(value){
      if(!this.validate(value)){
         console.log('不支持undefined与null等无效元素');
         return;
      }
      // 判断栈满
      if(this.length+1>this.size){
          console.log("栈已经满啦...不要再怼进来啦...");
          return false;
      }
      let index = this.length;
      // 入栈操作
      this.head[index] = value;
      // 栈大小自增
      this.length++;
      this.log()
      return this.head;
  }
  // 打印日志
  log(){
      console.log('此时栈的大小为'+this.size+',栈中有'+this.length+'个元素,顺序是:['+this.head+']');
  }
  // 校验数组元素的有效性
  validate(value){
      if(value!=undefined&&value!=null){
          return true;
      }else{
          return false;
      }
  }
}
// 遍历方法
Stack.prototype[Symbol.iterator] = function*(){
    let i = 0;
    while(i<this.head.length){
        let value = this.head[i];
        if(this.validate(value)){
            yield this.head[i];
        }
        i++;
    }
  }
module.exports = {
    Stack
}