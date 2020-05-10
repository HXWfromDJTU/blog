define(function(require, exports, module) {
    const name = 'module1'

    function getName() {
        return name
    }

    module.exports.module1 = {
        getName
    }
    
});