
// 使用Javascript数组模拟栈
class Stack{
  constructor(size){
      this.length = 0;
      this.head = null;
      this.size = size;
  }
  // 出栈
  pop(){
    if(this.length==0){
        console.log('哇啊...栈内已经没有元素啦..别pop啦');
        return false;
    }
    let head = this.head;
    this.length = this.head.length;
    this.head.shift()
  }
  // 入栈
  push(value){
      // 判断栈满
      if(this.length+1>this.size){
          console.log("栈已经满啦...不要再怼进来啦...");
          return false;
      }
      // 若栈为空
      if(this.length==0){
        this.head = [value];
      }
      // 若栈内已有元素
      this.head.unshift(value);
      this.length = this.head.length;
      return this.head;
  }
  show(){
      console.log(this.head)
  }

}
// 声明遍历元素
Stack.prototype[Symbol.iterator] = function*(){
    let i = 0;
    while(this.head[i]){
        yield this.head[i];
        i++;
    }
  }
module.exports = {
    Stack
}