// 独立模块，没有依赖其他模块
define(function(require, factory) {
    'use strict';
    let name = 'module-data'
    let data = 'inner-data'

    function getData() {
        return {
            name,
            data
        }
    }

    return {
        getData
    }
});