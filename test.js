function unique(array){
    let arr = array;
    let result = [];
    let hashtable = {};
    arr.forEach(item=>{
      if(!hashtable[item]){
          result.push(item);
          hashtable[item] = true; // 占位
      }
    })
    console.log(result)
    return result;
}

let  array = [44,44,44,56,78,78,99] 
unique(array)