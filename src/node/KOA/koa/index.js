const http = require('http')
const EventEmitter = require('events')
import compose from './compose'

class Koa extends EventEmitter {
  constructor () {
    super()
    this.keys = []
  }

  /**
   * 创建服务器
   * @param args
   */
  listen (...args) {
    const server = http.createServer(this.callback())
    return server.listen(...args)
  }


  use (middleware) {
    if (typeof middleware !== 'function') throw new TypeError('middleware must be a function')
    // 此处源码中，将 generator 函数转换为 普通函数

    // 添加中间件
    this.middlewares.push(middleware)

    // 返回实例本身，便于链式调用
    return this
  }

  /**
   * 为node.js native http server 创建一个请求处理器
   * @returns {function(*=, *=)}
   */
  callback () {
    // 使用 compose 函数，将所有的中间件串联起来
    const fn = compose(this.middlewares)

    if (!this.listenerCount('error')) this.on('error', this.onerror)

    const handleRequest = (req, res) => {
      const ctx = this.createContext(req, res)
      return this.handleRequest(ctx, fn)
    }

    return handleRequest
  }

  /**
   * 创建上下文对象
   * @param req 请求体
   * @param res 响应体
   * @returns {*}
   */
  createContext (req, res) {
    const context = Object.create(this.context)
    const request = context.rquest = Object.create(this.request)
    const response = context.response = Object.create(this.response)
    // app 指向 实例本身
    context.app = request.app = response.app = this
    context.req = request.req = response.req = req
    context.res = request.res = request.res = res

    request.ctx = request.ctx = context
    request.response = response
    response.request = request

    context.originalUrl = request.originalUrl = req.url
    context.state = {}

    return context
  }

  /**
   * 处理 callback 中的请求
    * @param ctx
   * @param fnMiddleware
   * @returns {Promise<T>}
   */
  handleRequest (ctx, fnMiddleware) {
    const res = ctx.res
    res.statusCode = 404
    // 成功与失败的回调
    const onerror = err => ctx.onerror(err)
    const handleResponse = () => respond(ctx)
    // todo: 暂未理解
    onFinished(res, onerror)
    // 成功则调用成功的回调，失败则进行失败的回调
    return fnMiddleware(ctx).then(handleResponse).catch(onerror)
  }

  onerror (err) {

  }
}

function respond (ctx) {

}

function onFinished(msg, listener) {

}
