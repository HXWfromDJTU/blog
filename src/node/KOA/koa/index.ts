const http = require('http')

class Koa {
  private callback = null
  private middlewares = []
  private keys = [] // 用于签名 cookie 的秘钥

  constructor () {

  }

  use (middleware: Function) {

  }

  listen (port: string | number) {
    http.createServer(this.callback)
          .listen(port)
  }
}
