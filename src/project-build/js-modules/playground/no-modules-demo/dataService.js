// 手动封装模块
(function (window) {
    let name  = 'dataServices.js'
    function getName () {
        return name;
    }
    window.dataServices = {getName}
})(window)

