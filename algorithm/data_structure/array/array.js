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
        this.length++;
        return this.head;
       }
       // 其他情况
       let index = this.head.length;
       this.head[index] = value;
    }
    // 数组尾部删除一个元素
    pop(){
        let lastIndex =  this.length;
        this.head[lastIndex] = null;
    }
    // 数组头部添加一个元素
    unshift(value){
       
    }
    // 数组头部删除一个元素
    shift(){
        let head = this.getHead();
        let length = this.length.get(this);
        let firstNode = heap[head.heapAddr];
        let nextNode = heap[head.heapAddr+this.dataSize];
        // 头指针指向下一个元素
        this.head.set(nextNode);
        // 长度自加
        length++;
        this.length.set(length)
        // head = null; // 这里就不手动释放掉头元素了
        // 返回头元素
        return head;
    }
    // 根据下标获取值
    getValueByIndex(offset){
       // 获取到要查询元素的
       let trueIndex = this.getHead() + this.dataSize * this.offset;
       return heap[trueIndex];
    }
    // 根据值获取下标（有多个只找到第一个）
    indexOf(value){
        // 从头开始遍历
        let head = this.getHead();
        let currentIndex = head.heapAddr;
        let index = 0;
        // 当元素存在的时候
        while(heap[currentIndex]){
            if(current.value == value){
                return index;
            }
            // 下标累加
            index++;
            // 计算下一个元素的下标
            currentIndex = head.heapAddr + index * this.dataSize;
        }
        // 没有找到的情况
        return undefined;
    }
    // 获取当前头指针
    getHead(){
        return this.head.get(this);
    }
}