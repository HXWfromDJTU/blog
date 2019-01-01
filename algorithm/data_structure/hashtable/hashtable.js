// javascript模拟实现散列表

class HashTable{
    constructor(){
        this.table = [];
    }
    /**
     * 哈希计算函数
     * @param {String} key  元素的key值
     */
    _hashFun(key){
        var hash=0;
        //从ASCII表中查到的ASCII值加到hash中
        for (var i=0;i<key.length;i++){
            hash+=key.charCodeAt(i);
        }
        //为了得到比较小的数值，我们会用hash和任意数除余
        return hash%87;
    }
    // 向散列表中添加一个元素
    add(key,value){
       let innerKey = this._hashFun(key);
       console.log('新加入元素，下标为值为： '+innerKey)
       this.table[innerKey] = value;
    }
    // 向散列表中删除一个元素
    delete(key){
        if(!key) return;
        let innerKey = this._hashFun(key);
        // 在JavaScript一个不存在的空间返回的值，会是undefined，所以可以用null标志为已删除。
        if(this.table[innerKey] !== undefined){
            this.table[innerKey] = null;
        }
    }
    // 获取一个哈希值
    get(key){
        let innerKey = this._hashFun(key);
         let value = this.table[innerKey];
         return value;
    }
}
// table 遍历的方法
HashTable.prototype[Symbol.iterator] = function *(){
     let index = 0;
     // 遍历数组
     while(index<this.table.length){
         let value = this.table[index];
         if(value !==undefined && value !== null){
             yield this.table[index];
         }
         index++;
     }
}

module.exports = {
    HashTable
}