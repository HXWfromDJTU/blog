const http = require('http')
const EventEmitter = require('events')
import compose from './compose'

class Koa extends EventEmitter {
  private middlewares = []
  private keys = [] // 用于签名 cookie 的秘钥

  constructor () {
    super()
  }

  /**
   * 创建服务器
   * @param args
   */
  listen (...args) {
    const server = http.createServer(this.callback())
    return server.listen(...args)
  }


  use (middleware: Function) {
    if (typeof middleware !== 'function') throw new TypeError('middleware must be a function')
    // 此处源码中，将 generator 函数转换为 普通函数

    // 添加中间件
    this.middlewares.push(middleware)

    // 返回实例本身，便于链式调用
    return this
  }

  callback () {
    const fn = compose(this.middlewares)
    if (!this.listenerCount('error')) this.on('error', this.onerror)

    const handleRequest = (req, res) => {
      const ctx = this.createContext(req, res)
      return this.handleRequest(ctx, fn)
    }
  }


  createContext(req, res) {

  }

  /**
   * Handle request in callback.
   *
   * @api private
   */

  handleRequest(ctx, fnMiddleware) {
    const res = ctx.res;
    res.statusCode = 404;
    const onerror = err => ctx.onerror(err);
    const handleResponse = () => respond(ctx);
    onFinished(res, onerror);
    return fnMiddleware(ctx).then(handleResponse).catch(onerror);
  }

  onerror(err) {

  }
}
