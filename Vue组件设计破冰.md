# Vue组件设计破冰

## togglebutton组件
需求：一个其他组件能够根据起状态的切换变换的状态按钮
技术点：
 1、外界对组件属性/数据的访问
 2、组件如何暴露自身的属性

构思：
  *  data 中设置 active属性作为开关标志
  *  


  ## 按条件分组组件

  构思：分组的判断，是在v-for循环展现时候进行，还是在数据导入后先整理好
  答：使用数据分组判断
`方案1`
  ```javascript
   computed: {
    _resultArr() {
      let _this = this;
      _this.resultArr = [];
      let tmpArr = [_this.recordData[0]];
      for (let i = 1; i < this.recordData.length; i++) {
        if (this._isSameDate(_this.recordData[i - 1], _this.recordData[i])) {
          tmpArr.push(_this.recordData[i])
        } else {
          _this.resultArr.push({
            'groupTime': _this.recordData[i].imageDate,
            'data': tmpArr
          })
          tmpArr = [];
          tmpArr.push(_this.recordData[i])
        }
      }
      return this.resultArr;
    }
  ```
  `方案2`
  ```javascript
 _resultArr() {
      let _this = this;
      //分组依据存放的 Map结构
      let groupNameMap = {};
      // 建立一个分组的数据容器
      let groupList = [];
      //便利循环取出记录数据
      for (let i = 0; i < this.recordData.length; i++) {
        // 简化循环的每一个项目
        let item = _this.recordData[i];
        // 默认按照位置进行排序
        let groupName = _this._conditionConverter(item);
        // 判断该分组是否已经出现过
        if (!groupNameMap[groupName]) {
          //若未出现过，则将这一个分组名称加入 groupName的集合中(新增分组名称)
          groupNameMap[groupName] = groupName;
          //  为集合添加集合名称，和初始化items数据集合
          groupList.push({
            groupName: groupName,
            items: [item]
          });
        } else {
          //若出现过了，则开始寻找自己的分组
          for (let j = 0; j < groupList.length; j++) {
            let thisGroup = groupList[j];
            if (thisGroup.groupName == groupName) {
              //找到了自己的那个分组，那么就加入这个分组
              thisGroup.items.push(item);
              //一条记录只可能属于一个分组，找到了即可退出遍历
              break;
            }
          }
        }
      }
      groupList = this._groupOrderByTime(groupList)
      //返回各个分组的总体信息
      return groupList;
    }
  ```