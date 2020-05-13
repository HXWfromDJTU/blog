define(function(require, exports, module) {
    const name = 'module2'

    function getName() {
        return name
    }

    module.exports.module2 = {
        getName
    }
    
    exports.getName = getName
});