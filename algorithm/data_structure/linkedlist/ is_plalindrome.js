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
    // 尾插法插入元素
   for(let i of str){
       list.append(i);
   }
   // 初始化快慢指针
   let head = list.getHead();
   let fastPointer = head;
   let slowPointer = head;
   let slowPrevious = head;
   // 移动快慢指针，停止时候得到中间元素的指针
   while(fastPointer){
    slowPrevious = slowPointer;
    slowPointer = slowPointer.next;
    fastPointer = fastPointer.next?fastPointer.next.next:fastPointer.next;
   }
   
   // 保存分界指针
   let midPointer = slowPointer;
   // 切分字符串链表
   let current = head;

   // 获取到前后两半的链表,后半段经过翻转操作
   let secondHalf = LinkedList.reverse.call(list,midPointer,-1,null,list);
   let firstHalf = head;
   let flag = true; // 设定检查结果
   while(secondHalf){
       if(firstHalf.value != secondHalf.value){
          flag = false;
          break;
       }
       firstHalf = firstHalf.next;
       secondHalf = secondHalf.next;
       
   }
   return flag;
}


console.log(isPlalindrome("aassaaa"));
console.log(isPlalindrome("aaassaaa"));

// 导出方法
module.exports = {
    isPlalindrome
}