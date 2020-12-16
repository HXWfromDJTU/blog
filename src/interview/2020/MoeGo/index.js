/**
 * 实现一个任务处理器
 * ① 最多能够同时执行 Capacity 个任务
 * ② 若超过需要被执行的任务,则需要进行等待
 */

 function AsyncExecutor (capacity) {
     this.capacity = capacity
     this.workingTasks = new Map()
     this.lazyTasks = []
     this.taskId = 0
 }

 AsyncExecutor.prototype.execute = function (task) {
    const taskExcutor = AsyncExecutor.promisify(task)

    if (this.workingTasks.size < this.capacity) {
        const taskResult = taskExcutor()
        const currId = this.taskId++
        this.workingTasks.set(currId, taskResult)

        taskResult.finally(() => {
            this.workingTasks.delete(currId)

            if (this.lazyTasks.length > 0) {
                const lazyTask = this.lazyTasks.shift()
                this.execute(lazyTask)
            }
        })
    }
     else {
        this.lazyTasks.push(task)
    }
 }

 AsyncExecutor.promisify = function (func) {
    return function (...args) {
       return new Promise((resolve, reject) => {
            try {
                const result = func.apply(this, args)

                if (result instanceof Promise) {
                    result.then(_data => {
                        resolve(_data)
                    }).catch(_err => {
                        reject(_err)
                    })
                } else {
                    resolve(result)
                }
            } catch (err) {
                reject(err)
            }
        })
    }
 }


 // 测试用例

 const asyncExecutor = new AsyncExecutor(1)

 function syncTask () {
    console.log('this is SyncTask')
 }

 function asyncTask () {
    setTimeout(() => {
        console.log('asyncTask')
    }, 100)
 }


 function promiseTask () {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('promiseTask')
        }, 2000)
    })
 }

 asyncExecutor.execute(syncTask)
 asyncExecutor.execute(asyncTask)
 asyncExecutor.execute(promiseTask)
 