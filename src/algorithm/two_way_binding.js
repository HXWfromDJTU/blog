function Watcher(fn) {
    this.update = function () {
        Dep.target = this
        fn()
        Dep.target = null
    }
    this.update()
}

function Observer(testObj, key, value) {
    // 每一个数据都应该对应维护一个依赖数组
    var dep = new Dep()

    // 深入递归每一个属性
    if (Object.prototype.toString.call(value) === '[object Object]') {
        Object.keys(value).forEach(innerKey => {
            new Observer(value, innerKey, value[innerKey])
        })
    }

    Object.defineProperty(testObj, key, {
        enumerable: true,
        configurable: true,
        get () {
            if (Dep.target) {
                dep.addSub(Dep.target)
            }
            return value
        },
        set (newVal) {
            value = newVal // 保持原来的值更新功能
            dep.notify() // 通知依赖该数据的所有组件都进行更新
        }
    })
}

// Dep实际对应的是一个被监听的数据
function Dep() {
    this.subs = []
}

// 为这个数据添加依赖的组件
Dep.addSub = (watcher) => {
    this.subs.push(watcher)
}

Dep.notify = () => {
    this.subs.forEach(watcher => {
        watcher.update()
    })
}
