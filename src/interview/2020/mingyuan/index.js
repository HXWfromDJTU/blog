// 怎样让(a===1 && a===2 && a===3)的值为true?
// if(a === 1 && a === 2 && a === 3){
//     console.log("hahahahha);
// }
// valueOf 与 toString 发生在隐式转换的时候
const a = {
    valuesArr: [1, 2, 3],
    get() {
        return this.valuesArr.shift()
    }
}



// This 对象的理解
var User = {
    count: 1,
    getCount: function () {
        return this.count;
    }
}
console.log(User.getCount()); // 1
var func = User.getCount;
console.log(func());  // undefined


// 实现一个函数clone，可以对JavaScript中的5种主要数据类型进行值复制
function isComplexObj(target) {
    return target !== null && typeof target === 'object'
}

const DATA_TYPE_MAP = {
    map: '[object Map]',
    set: '[object Set]',
    object: '[object Objec]',
    array: '[object Array]',
    function: '[object Function]'
}

function deepClone(target) {
    if (!isComplexObj(target)) {
        return target
    }

    const cloneTarget = new target.constructor() // 获取元素初始化

    const dataType = Object.prototype.toString.call(target)

    if (dataType === DATA_TYPE_MAP.map) {
        target.forEach((value, key) => {
            cloneTarget.set(key, deepClone(value))
        })
    }

    if (dataType === DATA_TYPE_MAP.set) {
        target.forEach((value) => {
            cloneTarget.add(deepClone(value))
        })
    }

    if (dataType === DATA_TYPE_MAP.array) {
        target.forEach(value => {
            cloneTarget.push(deepClone(value))
        })
    }

    if (dataType === DATA_TYPE_MAP.object) {
        Object.keys(target).forEach(key => {
            cloneTarget[key] = deepClone(object[key])
        })
    }

    if (dataType === DATA_TYPE_MAP.function) {
        // 字符串解析 后 new Function
        // toString 后 使用 eval
    }

    return cloneTarget
}


// 代码实现（有几种实现）
// var arr = [
//     {
//         id:1,
//         children:[...] | null
//     },
//     ...
// ]
// 变量arr是一个object数组，数组元素为object，有2个属性
// id：数字类型
// children：有两种类型，一种是数组，结构类似于变量arr；一种是null
// 请用代码实现从变量arr中提取出孙子元素的id组成一个一维数组，如[1,2,3,...]

// 广度优先
function flattenTreeBFS(objArr) {
    var result = []
    var treeNode = [] // 双端队列

    objArr.forEach(root => {
        treeNode.push(root)

        while (treeNode.length) {
            const currNode = treeNode.shift() // 左边出队一个节点
    
            result.push(currNode.id)
    
            if (Array.isArray(currNode.children)) {
                treeNode.push(...currNode.children)
            }
        }
    })

    return result
}

// 深度优先
// var result = []
// function flattenTreeDFS(objArr) {
//     var treeNode = [...objArr]

//     const currNode = treeNode.shift()
//     result.push(currNode.id)

//     if (Array.isArray(currNode.children)) {

//     }
// }

var arr = [{
    id: 1,
    children: [{
        id: 11,
        children: [{
            id: 111,
            children: [{
                id: 1111,
                children: null
            },{
                id: 1112,
                children: null
            }, {
                id: 1113,
                children: null
            }]
        }]
    },{
        id: 12,
        children: [{
            id: 121,
            children: null
        },{
            id: 122,
            children: null
        },{
            id: 123,
            children: [{
                id: 1231,
                children: null
            }]
        }]
    }]
},{
    id: 2,
    children: [{
        id: 21,
        children: null
    }]
}]


// 不可变数组的范围求和
// 给定一个整数数组 nums，计算出从i个元素到第j个元素的和（i<=j），包括nums[i]和nums[j].
// 例子：
// const nums = Object.freeze([-2,0,3,-5,2,-1]);
// sumRange(0,2) // 1
// sumRange(2,5) // -1
// sumRange(0,5) // -3
// 注意：
// 假定数组的值不会改变（如上面代码，nums因为Object.freeze的缘故可读不可写）
// sumRange可能会被使用多次，求不同范围的值
// 数组规模可能很大（比如超过10000个数），注意运行时间

var nums = []
var resultMap = new Map() // 使用 map 缓存结算过的结果

function sumRange(left, right) {
    var argStr = arguments[0] + ',' + arguments[1]

    // ① 精确匹配结果
    if (resultMap.has(argStr)) {
        return resultMap.get(argStr).total
    }

    // ② 缩小范围查找
    for (item of resultMap) {
        if (item[1].min > left && item[1].max < right) {
            return sumRange(left, item[1].min - 1) + item[1].total + sumRange(item[1].max + 1, right)
        }
    }

    // ③ 使用蛮算
    var total = 0

    for (var i = left; i <= right; i++) {
        total += nums[i]
    }

    resultMap.set(argStr, {
        min: left,
        max: right,
        total: total
    })

    return total
}

function sumRang2 (left, right) {
    var sumRecord = []
    sumRecord[0]

    nums.forEach((num, index) => {
        sumRecord[index + 1] = sumRecord[index] + num
    }) 

    return sumRecord[right + 1] - sumRecord[left]
}

// 实现一个LazyMan，可以按照以下方式调用
// LazyMan("Hank") 输出
// Hi！This is Hank!

// LazyMan("Hank").sleep(10).eat("dinner"); 输出
// Hi! This is Hank!
// // 等待10秒...
// Wake up after 10
// Eat dinner~

// LazyMan("Hank").eat("dinner").eat("supper") 输出
// Hi This is Hank!
// Eat dinner~
// Eat supper~

// LazyMan("Hank").sleepFirst(5).eat("supper") 输出
// // 等待5秒
// Wake up after 5
// Hi This is Hank!
// Eat supper

// 以此类推
function LazyMan (name) {
    var taskList = []
    var _name = name

    _sayHello()

    setTimeout(function () {
        _next()
    })

    function _next () {
        if (taskList.length) {
            const fn = taskList.shift()
            fn()
        }
    }

   function _sayHello () {
        taskList.push(function () {
            console.log('Hi this is ' + _name)
            _next()
        })
    }

    function sleepFirst (wait) {
        taskList.unshift(function () {
            setTimeout(function () {
                console.log('等待' + wait + 's')
                _next()
            }, wait)
        })
        return this
    }

    function sleep (wait) {
        taskList.push(function () {
            setTimeout(function () {
                console.log('等待' + wait + 's')
                _next()
            }, wait)
        })
        return this
    }

    function eat (sth) {
        taskList.push(function () {
            console.log('Eat ' + sth)
            _next()
        })
        return this
    }


    return {
        sleep,
        eat,
        sleepFirst,
    }
}

/**
 * JavaScript将具有父子关系的原始数据格式化成树形结构数据(id,pid)
 *  
 * var data = [
      { id: 2, pid: 4, text: "E[父C]" },
      { id: 1, pid: null, text: 'A' },
      { id: 4, pid: 1, text: "C[父A]" },
      { id: 3, pid: 7, text: "G[父F]" },
      { id: 5, pid: 6, text: "D[父B]" },
      { id: 7, pid: 4, text: "F[父C]" },
      { id: 6, pid: null, text: 'B' }
    ];
 */

function buildTree(flattenTreeArr) {
    let nodeMap = {}
    let treeArr = []

    flattenTreeArr.forEach(item => {
        nodeMap[item.id] = item
    })

    for (let node in nodeMap) {
        if (!node.pid) {
            treeArr.push(node)
        } else {
            const parNode = nodeMap[node.pid]

            if (!Array.isArray(parNode.children)) {
                node.children = [node]
            } else {
                node.children.push(node)
            }
        }
    }

    return treeArr
  }

 // 请使用正则表示式实现方法 numSplit，为任意数字添加千分位分隔符，注意参数校验
 function formatNum(num) {
    // (num.toFixed(2) + '') 保留两位小数
    return num && num.toString().replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
  }