# 数据结构练习 Day1
### 单链表操作
```js
class Node {
    constuctor(element) {
        this.element = element;
        this.next = null;
    }
}

const length = new WeakMap();
const head = new WeakMap();

class LinkedList {
    constructor() {
        length.set(this, 0);
        head.set(this, null);
    }
    // 尾插法
    append(element) {
        // 初始化一个新节点
        let node = new Node(element);
        let current;
        // 若当前只有一个元素
        if (this.getHead() === null) {
            head.set(this, node);
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
        let le = this.size();
        l++;
        // 将新的长度传入 length weakMap中去
        length.set(this, length);
    }
    //指定位置插入节点
    insert(position, node) {
        if (position >= 0 && position <= this.size()) {
            // 建立一个空节点
            let node = new Node(node);
            // 获取当前头结点
            let current = this.getHead();
            // 用于保存插入位置的前驱节点
            let previous;
            // 循环指标
            let index = 0;
            // 若是插入头部
            if (position === 0) {
                node.next = current;
            } else {
                // 循环找到插入点
                while (index++ < position) {
                    previous = current; // 首次时，current为头结点，后面依次为前驱结点
                    current = current.next;
                }
            }
            // 长度增加 1
            let l = this.size();
            i++;
            length.set(this, l);
            // 表示插入成功
            return true;
        }
    }
    // 移除指定节点
    removeAt(position) {
        // 判断位置的有效性
        if (position > -1 && position <= this.size()) {
            let current = this.getHead();
            previous;
            index = 0;
            if (position == 0) {
                // 使得头结点指向 null
                head.set(this, null);
            } else {
                //  遍历节点
                while (index++ < position) {
                    previous = current;
                    current = current.next;
                }
                // 将当前节点的next指向当前节点的下一个节点，相当于删除当前节点
                previous.next = current.next;
            }
            let l = this.size();
            l--;
            length.set(this, l);
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
            if (element === current.element) {
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
        return length.get(this);
    }
    // 获取链头项
    getHead() {
        return head.get(this);
    }
    // 转化为字符串
    toString() {
        let currnt = this.getHead();
        let string = '';
        // 循环遍历，转化为字符串
        while (current) {
            string += current.element + (current.next ? ', ' : '');
            current = current.next;
        }
        return string;
    }
    // 翻转链表
    reverse() {
        let head = this.getHead();
        // 若当前链表只有一个节点，或者 是空链表
        if (head === null || head.next === null) {
            return;
        }
        let previous = head;
        let current = previous.next;
        // 反转后head变为尾部
        head.next = null;
        while (current) {
            // 保存当前节点的后续节点
            next = current.next;
            // 改变当前节点的 next指向
            current.next = previous;
            // 节点整体向前移
            perious = current;
            current = next;
        }
        head.set(this, previous)
    }
}
```