/**
 * 
 * 要求：根据以下输出结果，封装一个类或者闭包
 * 
LazyMan('Tony');
// Hi i am Tony  


LazyMan('Tony').sleep(10).eat('lunch')
// Hi I am Tony  
// 等待了10秒....
// I am eating lunch  



LazyMan('Tony').eat('lunch').sleep(10).eat('dinner');
// Hi I am Tony  
// I am eating lunch  
// 等待了10秒....
// I am eating dinner  


LazyMan('Tony').eat('lunch').eat('dinner').sleepFirst(5).sleep(10).eat('junk food');
// Hi I am Tony  
// 等待了5秒....
// I am eating lunch  
// I am eating dinner
// 等待了10秒....
// I am eating junkfood  


 * 
 * 
 * 
 * 
 */


/**
 * LazyMan 类
 * @param {*} name lazyman的名字
 */
function LazyMan(name) {
    this.time = (new Date()).getTime();
    this.lazyWorks = [];
    var sayHello = function (name) {
        console.log('Hi I am ' + name);
        this.next();
    }
    this.lazyWorks.push({
        fun: sayHello,
        param: [name]
    })
    var _this = this;
    setTimeout(function () {
        _this.next();// 启动执行
    }, 0)
    return _this;
}
/**
 * 现在吃东西
 */
LazyMan.prototype.eat = function (sth) {
    var eating = function (sth) {
        console.log('i am eating ' + sth);
        this.next(); // 继续任务
    }
    this.lazyWorks.push({
        fun: eating,
        param: [sth]
    })
    return this;
}
/**
 * 现在休息
 */
LazyMan.prototype.sleep = function (time) {
    var _this = this;
    var sleep = function (time) {
        setTimeout(function () {
            console.log('等待了' + time + '秒');
            _this.next(); // 继续启动任务
        }, time * 1000);
    }
    this.lazyWorks.push({
        fun: sleep,
        param: [time]
    })
    return this;
}
/**
 * 优先休息
 */
LazyMan.prototype.sleepFirst = function (time) {
    var _this = this;
    var sleepFirst = function (time) {
        setTimeout(function () {
            console.log('等待了' + time + '秒');
            _this.next();
        }, time * 1000)
    }
    this.lazyWorks.unshift({
        fun: sleepFirst,
        param: [time]
    })
    return this;
}
// 自执行器
LazyMan.prototype.next = function () {
    if (this.lazyWorks.length === 0) return; // 执行站清空，停止执行
    var cb = this.lazyWorks.shift();
    cb.fun.apply(this, cb.param)
}

    (new LazyMan('tony')).eat('knife').sleep(3)



// 闭包版本   

var LazyMan = (function (name) {
    var _this = this;
    _this.name = name;
    this.lazyWorks = [];  // 执行栈   
    // sayHello 操作
    var sayHello = function (name) {
        console.log('Hi I am ' + name);
        next();
    }

    // 自执行器
    var next = function () {
        if (this.lazyWorks.length === 0) return; // 执行站清空，停止执行
        var cb = this.lazyWorks.shift();
        cb.fun.apply(this, cb.param)
    }
    // 吃东西操作
    var eat = function (sth) {
        var eating = function (sth) {
            console.log('i am eating ' + sth);
            next();
        }
        this.lazyWorks.push({
            fun: eating,
            param: [sth]
        })
        return this;
    }

    var sleep = function (time) {
        var _this = this;
        this.lazyWorks.push({
            fun: function (time) {
                setTimeout(function () {
                    console.log('等待了' + time + '秒');
                    next(); // 继续启动任务
                }, time * 1000)
            },
            param: [time]
        })
        return this;
    }

    var sleepFirst = function (time) {
        var _this = this;
        this.lazyWorks.unshift({
            fun: function (time) {
                setTimeout(function () {
                    console.log('等待了' + time + '秒');
                    next();
                }, time * 1000)
            },
            param: [time]
        })
        return this;
    }

    return function () {
        var _this = this;
        // 初始化执行的时候默认推入 sayHello
        this.lazyWorks.push({
            fun: sayHello,
            param: [_this.name]
        })

        setTimeout(function () {
            next();// 启动执行
        }, 0)
        // 向外暴露
        return { sleep, sleepFirst, eat, lazyWorks: _this.lazyWorks }
    }
})()
