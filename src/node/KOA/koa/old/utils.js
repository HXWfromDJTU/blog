/**
 * 使得对象的内部函数被外部代理 Getter
 * @param {*} obj 用于承载属性的对象名称
 * @param {*} property 多出来的一层键
 * @param {*} key 最重要读取的属性名称
 */
function defineGetter(obj, property, key) {
    obj.__defineGetter__(key, function () {
        return this[property][key];
    });
}
/**
 * 使得对象的内部函数被外部代理 Setter
 * @param {*} obj 用于承载属性的对象名称
 * @param {*} property 多出来的一层键
 * @param {*} key 最重要读取的属性名称
 */
function defineSetter(obj, property, key) {
    obj.__defineSetter__(key, function (val) {
        this[property][key] = val;
    })
}


module.exports = { defineGetter, defineSetter };