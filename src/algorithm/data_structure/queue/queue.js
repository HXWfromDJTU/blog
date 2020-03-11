/**
 * @description 使用JS数组模拟顺序队列
 * @param size 队列的大小
 * @param dataSize 存储数据类型的大小(默认存储的类型都是一样的)
 * 注意若要触发数据搬移，则需要在global下配置 global.seriesHeapSize 模拟内存连续空间大小
 * @author SwainWong
 */
class Queue{
   constructor(size,dataSize){
       this.size = size;
       this.head = [];
       this.length = 0;
       this.headIndex = 0;
       this.seriesHeapSize = global.seriesHeapSize;
       this.dataSize = dataSize || 1;
   }
   // 入队操作
   enqueue(value){
    this.log();
       // 判空
      if(!this._validate(this)){
          console.log('不支持undefined与null等无效元素入队');
          return false;
      }
      if(this.length+1>this.size){
          console.log('队列已满...元素'+value+'入队失败');
          return false;
      }
      // 插入元素先进行空间校验，判断是否要进行数据搬移
      this._checkSeriseHeap();
      let index = this.headIndex + this.length;
      this.head[index] = value;
      this.length++;
      //this.log();
      return this.head;
   }
   // 出队操作
   dequeue(value){
      if(this.length==0){
          console.log('队中已无元素，出队操作失失败哦...')
          return false;
      }
      // 保存队头元素 TODO:同样有引用型对象拷贝的隐患
      let returnValue = this.head[this.headIndex];
      // 删除队头元素
      this.head[this.headIndex] = null;
      // 头元素下标自加
      this.headIndex++;
      // 数目自减1 
      this.length--;
      return returnValue;
   }
   // 内容搬移
   _move(){
    let index = 0;
    let currnetIndex = this.headIndex;
     while(index<this.length){
       this.head[index] = this.head[currnetIndex];
       index++;
       currnetIndex++;
     }
     // 移动后头元素下标归 0
     this.headIndex = 0;
     console.log('连续内存空间不足，触发搬移操作')
     return this.head;
   }
   // 检查内存中是否还有足够的连续空间，若没有则触发搬移（需要在初始化的时候穿入数据类型的大小和设置global的连续内存空间大小seriesHeapSize）
   _checkSeriseHeap(){
       if(!global.seriesHeapSize){
           return true;
       }
       if(this.dataSize * (this.headIndex+this.length) > global.seriesHeapSize){
          this._move();
       }
   }
   // 校验值有效
   _validate(value){
       if(value!=undefined&&value!=null){
           return true;
       }else{
           return false;
       }
   }
   // 日志方法
   log(){
       console.log(this.head)
   }
}
// 遍历队列
Queue.prototype[Symbol.iterator]=function*(){
    let num = 0;
    while(num<this.length){
        yield this.head[this.headIndex+num];
        num++
    }
}
// 模块导出
module.exports = {
    Queue
}