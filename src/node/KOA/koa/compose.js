function compose (middlewares) {
  if (!Array.isArray(middlewares)) throw new TypeError('Middlewares must be an array')
  for (const fn of middlewares) {
    if (typeof fn !== 'function') {
      throw new TypeError('item of middlewares must be an functions')
    }
  }

  /**
   * compose
   * @description
   * @point 递归就是天然的洋葱模型实现
   * @point 每个中间件的调用应该为异步的
   * @point
   * @return compose 是一个作用是将所有的中间件串联起来，包装成一个函数，并且返回。这里要使用高阶函数
   */
  return function (context, next) {

    function dispatch(i) {
      let fn = middlewares[i] // ① 取出当前的中间件，fn指向每一个中间件
      if (!fn) return // ③ 为递归设定终结条件
      return fn(context, dispatch(i + 1)) // ② 形成初步的递归调用
    }

    dispatch(0) // ④ 设定一个递归启动点
  }
}

module.exports.compose = compose
