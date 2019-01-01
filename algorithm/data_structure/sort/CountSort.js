// 计数排序


let countingSort = function(arr,max){
    // 申请计数容器
    let container = new Array(max+1);
    // 遍历元素,放入“桶”中
    for(let i=0;i<arr.length;i++){
        let key = arr[i];
        // 累加计数
       if(!container[key]){
        container[key] =1;
       }else{
        container[key]++;
       }
    }
    // 输出结果
    let result = [];
    for(let j=0;j<container.length;j++){
        while(container[j]){
            result.push(j); // 下标就是我们想要的元素值
            container[j]--; // 取出一次，计数减一
        }
    }
    return result;
}

module.exports = {
    countingSort
}