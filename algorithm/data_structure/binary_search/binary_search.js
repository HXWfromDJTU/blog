// 使用递归实现二分查找算法
let  binary_search_recursion = function(value,arr,bottom,top){
    // 设定边界
    let low=bottom;
    let high = top;
    let mid = Math.floor((low + high)/2);
    if(low>=high){
        return;
    }
    if(arr[mid]==value){
        return mid;
    }
    // 目标在前半段
    if(arr[mid]>value){
        high = mid-1;
        return binary_search_recursion(value,arr,low,high);
    }else{
        low = mid+1;
        return binary_search_recursion(value,arr,low,high);
    }
}

// 使用while循环实现二分查找
let binary_search_while = function(value,arr,bottom,top){
   let low = bottom;
   let high = top;
   let mid = 0;
   while(low<high){
    mid = Math.floor((low+high)/2);
    console.log(low,high,mid,arr[mid])
      if(arr[mid]==value){
          return mid;
      }else if(arr[mid]<value){
          low = mid+1;
      }else{
          high = mid-1;
      }
   }
}
module.exports = {
    binary_search_recursion,
    binary_search_while
}