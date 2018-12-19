let {LinkedList} = require('./linkedList')

function isPlalindrome(str){
    // 非法参数，直接返回
    if(!str) return false; 
    if(!typeof(str)=='string') return false;
    // 获取长度
    let length = str.length;
    // 长度为1直接判断为回文字符串
    if(length==1){
        return true;
    }
    // ****** 长度大于一的情况 *****
    //新建链表作为容器
    let  list = new LinkedList();
    let flag = true; // 设定检查结果
   for(let i of str){
       list.append(i);
   }
   // 初始化快慢指针
   let head = list.getHead();
   let fastPointer = head;
   let slowPointer = head;
   // 移动快慢指针
   while(fastPointer){
    slowPointer = slowPointer.next;
    fastPointer = fastPointer.next?fastPointer.next.next:fastPointer.next;
   }
   // 保存分界指针
   let midPointer = slowPointer;
   // 切分字符串链表
   slowPointer = null;
   let current = head;
   
}

isPlalindrome("sadasdsdfdsgsd")

// 导出方法
module.exports = {
    isPlalindrome
}