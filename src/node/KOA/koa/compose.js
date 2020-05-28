export default function compose (middlewares) {
  if (!Array.isArray(middlewares)) throw new TypeError('Middlewares must be an array')
  for (const fn of middlewares) {
    if (typeof fn !== 'function') {
      throw new TypeError('item of middlewares must be an functions')
    }
  }

  return function (context, next) {
    let index = -1
    return dispatch(0)
    // 递归函数
    function dispatch (i) {
      // 终止条件，也就是所有的中间件都执行完了，返回一个 Promise
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      // 取出第一个中间件
      let fn = middlewares[i]
      if (i === middlewares.length) fn = next
      // 若取不到中间件，则直接返回一个 resolve 状态的 Promise
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)))
      }
      catch (err) {
        return Promise.reject(err)
      }
    }
  }
}
