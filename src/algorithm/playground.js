const _new  = function (Fun) {
    const obj = Object.create(Fun.prototype)
    const CtorRes = Fun.apply(obj, Array.prototype.slice.call(arguments, 1))

    return typeof CtorRes !== null && typeof CtorRes === Object ? CtorRes : obj
}


const _extend = function (subCtor, superCtor) {
    const subCtorPrototype = Object.create(superCtor.prototype) // 将子类的原型指向父类的原型，搭建好原型链
    subCtorPrototype.constructor = subCtor // 联通构造器
    subCtor.prototype = subCtorPrototype // 联通原型

    // 一定注意，这里不会去管子类构造器中是否去调用父类构造函数
}