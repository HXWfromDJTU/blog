var {LinkedList,Node} = require('./linkedList')


/**
* @ClassName: HeapBuffer
* @Description: 模拟一个内存缓冲区，采用LRU算法进行淘汰
* @author SwainWong
* @param size 缓冲区的限制大小
*/
class HeapBuffer{
    constructor(size){
        // 创建一个单链表
       this.list = new LinkedList();
       this.size = size || 10; // 缓存大小
    }
    /**
     * @name push
     * @param {*} value 
     * @description 向内存缓冲区中添加元素
     */
   push(value){
       if(!value){
           console.log("缓存内容value不能够为空！！！");
       }
       if(this.list.size()<this.size){
           // 使用头插法模拟LRU算法
           this.list.insert(0,value);
       }else{
           this.list.removeAt(this.list.size()-1);
           this.push(value);
       }
   }
   /**
    * @name show
    * @description 便利输出元素
    */
   show(){
       for(let node of this.list){
           console.log(node.value)
       }
   }
}
// 新建缓存缓冲区对象，设置大小为5
let buffer = new HeapBuffer(3);
buffer.push("缓存块1")
buffer.push("缓存块2")
buffer.push("缓存块3")
buffer.push("缓存块4")
console.log("缓存中已有元素" + buffer.list.size()+ "，还剩" + (buffer.size - buffer.list.size()) +"个空间")
buffer.show()