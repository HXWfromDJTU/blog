function MyPromise(executor) {
    this.status = MyPromise.STATUS.pending // 初始化为 pending
    this.rejectHandlers = []
    this.resolveHandlers = []
    this.finallyHandlers = []
    this.PromiseResult = undefined

    var resolveFun = function (data) {
        if (this.status !== MyPromise.STATUS.pending) return

        this.status = MyPromise.STATUS.fulfilled
        this.PromiseResult = data

        // 清空并执行所有的 resolveHandlers
        while (this.resolveHandlers.length > 0) {
            const resolveHandler = this.resolveHandlers.shift() // 双堆队列，从头开始执行

            MyPromise.asyncExcutor(() => {
                resolveHandler(this.PromiseResult)
            })
        }

        // 清空并执行所有的 finallyHandlers
        while (this.finallyHandlers.length > 0) {
            const finallyHandler = this.finallyHandlers.shift() // 双堆队列，从头开始执行

            MyPromise.asyncExcutor(() => {
                finallyHandler()
            })
        }
    }

    var rejectFun = function (errMsg) {
        if (this.status !== MyPromise.STATUS.pending) return

        this.status = MyPromise.STATUS.rejected
        this.PromiseResult = errMsg

        // 清空并执行所有的 rejectHandlers
        while (this.rejectHandlers.length > 0) {
            const rejectHandler = this.rejectHandlers.shift() // 双堆队列，从头开始执行

            MyPromise.asyncExcutor(() => {
                rejectHandler(this.PromiseResult)
            })
        }

        // 清空并执行所有的 finallyHandlers
        while (this.finallyHandlers.length > 0) {
            const finallyHandler = this.finallyHandlers.shift() // 双堆队列，从头开始执行

            MyPromise.asyncExcutor(() => {
                finallyHandler()
            })
        }
    }

    // 同步执行的异常捕获
    try {
        executor(resolveFun.bind(this), rejectFun.bind(this))
    }
    catch (err) {
        rejectFun(err)
    }

    return this
}

MyPromise.STATUS = {
    fulfilled: 'fulfilled',
    rejected: 'rejected',
    pending: 'pending'
}

MyPromise.prototype.catch = function (userRejectHandler) {
    this.then(null, userRejectHandler)  // catch 的实现，不需要另外单独处理。可以借用 then 方法进行处理
}

MyPromise.prototype.then = function (userResolveHandler, userRejectHandler) {

    /**
     * 值传递: 原生API也允许不传入 userResolveHandler， 此处应该给默认值，并且实现
     * 错误穿透: 原API允许不传递 userRejectHandler，所以此处应该设置 userRejectHandler 默认值
     **/
    userRejectHandler = typeof userRejectHandler !== 'function' ? err => { throw err } : userRejectHandler // 异常穿透
    userResolveHandler = typeof userResolveHandler !== 'function' ? data => data : userResolveHandler // 值穿透

    return new Promise((resolve, reject) => {
        /**
         * 处理移除函数执行结果
         * 1.返回一个 Promise，状态根据当前函数执行结果而定
         * 2. 并且需要处理好三种情况
         *      1. 非promise
         *      2. promise(resolve + rejected)
         *      3. error
         * 3. 三种状态的处理流程，可以提取一个公共函数
         * */
        var resultHandler = (excutor) => {
            try {
                var result = excutor(this.PromiseResult)
                if (result instanceof Promise) {
                    result.then(d => {
                        resolve(d)
                    }, e => {
                        reject(e)
                    })
                }
                else {
                    resolve(result)
                }
            } catch (err) {
                reject(err) // 执行异常 状态为 rejected
            }
        }

        // pending 时才进行入队保存
        if (this.status === MyPromise.STATUS.pending) {
            // 缓存来的函数，也要需要将这一层的 resolve/reject 处理流程加入进行，以便后续清空队列的时候改变这里的promise状态
            this.resolveHandlers.push(() => {
                resultHandler(userResolveHandler)
            })
            this.rejectHandlers.push(() => {
                resultHandler(userRejectHandler)
            })
        }

        // 若状态已经改变了，则直接执行掉，不需要放到异步队列中

        // 成功状态
        if (this.status === MyPromise.STATUS.fulfilled) {
            resultHandler(userResolveHandler)
        }

        // 失败状态
        if (this.status === MyPromise.STATUS.rejected) {
            resultHandler(userRejectHandler)
        }
    })
}

MyPromise.prototype.finally = function (userFinallyHandler) {
    userFinallyHandler = typeof userFinallyHandler !== 'function' ? () => {} : userFinallyHandler

    return new MyPromise((resolve, reject) => {
        var resultHandler = (excutor) => {
            try {
                var result = excutor()
                if (result instanceof Promise) {
                    result.then(d => {
                        resolve(d)
                    }, e => {
                        reject(e)
                    })
                }
                else {
                    resolve(result)
                }
            } catch (err) {
                reject(err) // 执行异常 状态为 rejected
            }
        }

        if (this.status === MyPromise.STATUS.pending) {
            this.finallyHandlers.push(() => {
                resultHandler(userFinallyHandler)
            })
        } else {
            resultHandler(userFinallyHandler)
        }
    })
    
}

MyPromise.reslove = function (data) {
    return new MyPromise((resolve) => {
        resolve(data)
    })
}

MyPromise.reject = function (reason) {
    return new MyPromise((resolve, reject) => {
        reject(reason)
    })
}

MyPromise.race = function (promises) {
    if (!Array.isArray(promises)) throw new Error('param error')

    return new MyPromise((resolve, reject) => {
        promises.forEach(promise => {
            if (promise instanceof Promise) {
                promise.then(data => {
                    resolve(data)
                }, err => {
                    reject(err)
                })
            } else {
                resolve(promise) // 若为常量，则直接resolve
            }
        })
    })
}

MyPromise.all = function (promises) {
    // 成功时，注意返回结果的数组元素的顺序
    if (!Array.isArray(promises)) throw new Error('param error')

    var fulfilledCount = 0
    var resolveRes = []

    return new MyPromise((resolve, rejecte) => {
        promises.forEach(promise => {
            if (promise instanceof Promise) {
                promise.then((data, index) => {
                    resolveRes[index] = data // 保存结果到对应的位置

                    if (++fulfilledCount === promises.length) {
                        resolve(resolveRes)
                    }
                }, err => {
                    rejecte(err)
                })
            } else {
                if (++fulfilledCount === promises.length) {
                    resolve(resolveRes)
                }
            }
        })
    })
}

MyPromise.asyncExcutor = function (func) {
    // 策略1. 如果浏览器支持 MutationObserver
    if (typeof (MutationObserver) !== 'undefined') {
        this.targetNode = document.createElement('i');
        this.targetNode.id = 'INITIAL';
        
        // 配置所需检测对象
        let config = {
            attributes: true
        }

        // 声明 DOM 变动后触发的回调函数
        const mutationCallback = (mutationsList) => {
            for (let mutation of mutationsList) {
                // mutation.type 指向的是 配置项中被修改的项目名称
                if (mutation.type === 'attributes') {
                    func()
                }
            }
        };
        // 使用构造器，初始实例化 MutationObserer对象
        let observer = new MutationObserver(mutationCallback);
        // 开启监听属性，传入监听DOM对象，和需要监听的内容
        observer.observe(this.targetNode, config);

        // 手动触发
        this.targetNode.id = this._status
        return // 拦截式
    }

    // 策略2. 若是node环境，则直接使用 nextTick实现微任务
    if (process) {
        process.nextTick(_ => {
            func()
        })
        return
    }

    // 策略3. 退化到使用 messageChannel（宏任务） 去实现 ，但是比一般的定时器优先级要高
    if (typeof (MessageChannel) !== 'undefined') {
        let mc = new MessageChannel();
        let port1 = mc.port1;
        let port2 = mc.port2;
        // 模拟一个传输过程，为了创建一个优先级比较高的宏任务
        port1.postMessage({});
        port2.onmessage(_ => {
            func()
        })
        return 
    }
    // 策略4. 最后退化到使用 setTimeout 去实现
    setTimeout(_ => {
        func()
    }, 0)
}







// ======= test case 1 ========
const promise = new MyPromise((resolve, reject) => {
    // throw 'error resolve1-2'
    setTimeout(() => {
        resolve('OK')
    }, 2000)
})

promise.then(data => {
    console.log('resolve111')
})

promise.then(data => {
    console.log('resolve222 about to throw error')
    throw new Error('sudden error')
})

promise.catch(err => {
    console.log('reject 1111')
    console.log(err)
})

promise.then(null, err => {
    console.log('reject 222')
    console.log(err)
})

promise.then(null, err => {
    console.log('reject 333')
    console.log(err)
})

promise.then(data => {
    console.log('resolve333')
})

promise.finally(123123)

promise.finally(data => {
    console.log('finally2222')
})

promise.finally(data => {
    console.log('finally333')
})


console.log('同步 promise 当前状态', promise)


// ===== test case2 链式调用 ======
// const promise2 = new MyPromise((resolve, reject) => {
//     console.log('===== test case2 链式调用 ======')
//     setTimeout(() => {
//         resolve('OK')
//     }, 2000)
// })

// promise2.then(data => {
//     console.log(data)
//     return Promise.reject('Oh No')
// }).then(data => {
//     console.log(data)
// }).catch(reason => {
//     console.log(reason)
// })

// console.log(123)

// Promise.finally


