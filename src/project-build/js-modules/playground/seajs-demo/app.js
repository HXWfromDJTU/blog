
define(function(require, factory) {
    const name = 'app.js'

    // 同步引入
    let module1 = require('./module1')
    console.log('module1', module1)

    // 异步引入
    require.async('./module2', function (getName) {
        console.log('module2', getName)
    })

});