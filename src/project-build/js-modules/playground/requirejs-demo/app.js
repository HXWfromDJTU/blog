// require.js 测试入口
(function () {
    // require.js 的配置
    requirejs.config({
        paths: {
            jquery: '../libs/jquery.min'
        }
    })
    // 主模块引入的
    requirejs(['module-service', 'jquery'], function (moduleService, $) {
        moduleService.showMsg()
        moduleService.showModuleData()
        console.log($) // 打印出query的$函数
    })
})()