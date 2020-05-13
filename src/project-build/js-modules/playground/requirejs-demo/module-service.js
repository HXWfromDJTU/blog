// module-data 模块 依赖于 module-data.js 模块
define([
    'module-data',
], function(moduleData) {
    let msg = 'module-service'

    function showMsg () {
        console.log('data from module-service', msg)
    }

    // 向外层暴露“内层依赖”的方法
    function showModuleData () {
     console.log('data from module data:', moduleData.getData())   
    }

    return {showMsg, showModuleData}
});