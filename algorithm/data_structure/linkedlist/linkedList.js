                                                                                                                                                        class Node {
constructor(element) {
        this.value = element;
        this.next = null;
    }
}
class LinkedList {
    constructor() {
        // 初始化链表长度和链表头
        this.length = new WeakMap();
        this.head = new WeakMap();
        this.length.set(this, 0);
        this.head.set(this, null);
    }
    // 尾插法
    append(value) {
        // 初始化一个新节点
        let node = new Node(value);
        let current;
        // 若当前只有一个元素
        if (this.getHead() === null) {
            this.head.set(this, node);
        } else {
            // 若当前有多个元素
            current = this.getHead();
            // 不断循环到链表尾部
            while (current.next) {
                current = current.next;
            }
            // 链表尾部挂载节点
            current.next = node;
        }
        // 获取当前的长度
        let l = this.size();
        l++;
        // 将新的长度传入 length weakMap中去
        this.length.set(this, l);
    }
    //指定位置插入节点
    insert(position, value) {
        if (position >= 0 && position <= this.size()) {
            // 建立一个新节点
            let node = new Node(value);
            // 获取当前头结点
            let current = this.getHead();
            // 用于保存插入位置的前驱节点
            let previous;
            // 循环指标
            let index = 0;
            // 若是插入头部
            if (position === 0) {
                node.next = current;
                this.head.set(this, node);
            } else {
                // 循环找到插入点
                while (index++ < position) {
                    previous = current; // 首次时，current为头结点，后面依次为前驱结点
                    current = current.next;
                }
            }
            // 长度增加 1
            let l = this.size();
            l++;
            this.length.set(this, l);
            // 表示插入成功
            return true;
        }
    }
    // 根据位置移除指定节点
    removeAt(position) {
       
        // 判断位置的有效性
        if (position > -1 && position <= this.size()) {
            let current = this.getHead();
            console.log(current)
            let previous;
            let index = 0;
           
            if (position == 0) {
                // 使得头结点指向 null
                this.head.get(this, null);
            } else {
                //  遍历节点
                while (index++ < position) {
                    previous = current;
                    current = current.next;
                }
                // 将当前节点的next指向当前节点的下一个节点，相当于删除当前节点
                previous.next = current.next;
                // 释放前节点
                current.next = null; 
            }
            let l = this.size();
            l--;
            this.length.set(this, l);
            return current.node;
        }
    }
    // 根据节点值删除
    removeNode(data) {
        // 先遍历寻找到 index
        let index = this.indexOf(data);
        return this.removeAt(index);
    }
    // 根据值寻找序号
    indexOf() {
        let current = this.getHead();
        index = 0;
        // 循环遍历
        while (current) {
            // 判断每个值是否相等
            if (element === current.value) {
                return index;
            }
            index++;
            current = current.next;
        }
        return -1;
    }
    // =====  工具函数  ===========
    // 清空链表
    isEmpty() {
        return this.size() === 0;
    }
    // 返回链表包含的元素个数
    size() {
        return this.length.get(this);
    }
    // 获取链头项
    getHead() {
        return this.head.get(this);
    }
    // 转化为字符串
    toString() {
        let currnt = this.getHead();
        let string = '';
        // 循环遍历，转化为字符串
        while (current) {
            string += current.value + (current.next ? ', ' : '');
            current = current.next;
        }
        return string;
    }
    // 翻转链表
    reverse(customHead) {
      let head = this.head.get(this);
      // 调用类静态方法，实现链表反转
      LinkedList.reverse.call(this,head)   
    }
}
LinkedList.reverse = function(customHead,length,customTail,listObj){
        // 链表头部
        let head = customHead;
        // 声明步数，限制翻转的节点数量
        let step = 0;
        // 若当前链表只有一个节点，或者 是空链表
        if (head === null || head.next === null) {
            return head;
        }
        // 多于一个节点的情况
        let previous = head;
        let current = previous.next;
        let next = null;
        // 反转后head变为尾部
        head.next = null;
        while (current && (customTail?current!=customTail:true)) {
            // 保存当前节点的后续节点
            next = current.next;
            // 改变当前节点的 next指向
            current.next = previous;
            // 节点整体向前移
            previous = current;
            current = next;
            // 移动步数累加
            step++;
        }
        this.head.set(this, previous);
        return previous;
}
// 给链表添加一个遍历器
LinkedList.prototype[Symbol.iterator] = function *(params){
   let current =  this.getHead();
   while(current){
    yield current;
    current = current.next;
   }   
}
// 暴露模块
module.exports = {
    Node,
    LinkedList
};