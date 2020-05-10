// 定义一个有依赖的模块
(function (window, dataServices) {
    let msg = 'alert.js'
    function showMsg () {
        console.log(msg, dataServices.getName())
    }
    window.alerter = {showMsg}
})(window, dataServices)