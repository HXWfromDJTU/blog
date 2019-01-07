/**
 * 实现一个将扁平数据组合树的工具方法
 * 
 */
let treeFormat = function(data,customOpt){
      let result = Object.prototype.toString.call(data);
      // 判断输入数据是否为数组
      if(!result.indexOf('Array')){
          console.log('只支持输入数组');
          return;
      }
      let deafultOpt = {
          parentKey:'parentId',
          selfKey:'id',
          nameKey:'name'
      };
      // 合并用户配置与默认配置
      let option = Object.assign(deafultOpt,customOpt);  
      // 初始化根节点信息
      let root = {}; 
      root[option.nameKey] = '广东省公安局';
      root.children = [];
      // 建立一个map用于检索
      let nodeMap = {};
      // 当前元素遍历引用
      let current; 
      let len = data.length;
      // 将所有节点元素移动到一个map中，并且以自己的key为索引
      for(let i=0;i<len;i++){
        nodeMap[data[i][option.selfKey]] = data[i]; // 将元素存入map中
      }
      // 遍历节点map
      for(let i in nodeMap){
        current = nodeMap[i];
        if(current[option.parentKey] == null){
           root.children.push(current);// 无父节点，则直接放入result的最顶层作为顶层节点
        }else{
            // 不断放入
            let parentId = current[option.parentKey];
            let parentNode = nodeMap[parentId];
            console.log()
            if(!parentNode.children || parentNode.children==0){
                parentNode.children = [current];
            }else{
                parentNode.children.push(current);
            }
        }
      }
      return [root];
}



let flatData = [{
    id:1,
    parentId:null,
    name:'珠海市公安局'
},{
    id:2,
    parentId:null,
    name:'海州市长公安局'
},{
    id:4,
    parentId:null,
    name:'汕头市公安局'
},{
    id:5,
    parentId:4,
    name:'澄海分局'
},{
    id:6,
    parentId:2,
    name:'海州市区分区'
},{
    id:7,
    parentId:3,
    name:'南山分局'
},{
    id:8,
    parentId:7,
    name:'深南大道派出所'
},{
    id:3,
    parentId:null,
    name:'深圳市公安局'
}]



console.log(treeFormat(flatData))  



module.exports = {
    treeFormat
}