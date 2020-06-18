import * as EventEmitter from 'eventemitter3'
// import uniqueId from 'lodash-es/uniqueId'
const pkg = require('./package.json')
const JSON_RPC_VERSION = '2.0'
const WebSocket = require('ws')

interface IOption {
  url: string
  logger?: Console
}

interface IPromise {
  resolve: Function,
  reject: Function,
  method: string
}

export class ABCWebsocket extends EventEmitter {
  protected _serverUrl: string // 远端地址
  protected _ws: WebSocket // 原生ws实例
  protected _promises: Map<string, IPromise> // 请求哈希表
  protected _logger: Console // 日志工具

  constructor (option: IOption) {
    super()
    this._serverUrl = option.url
    this._ws = new WebSocket(this._serverUrl)
    this._logger = option.logger || console

    this._promises = new Map()

    this._ws.onmessage = event => {
      console.log(event.data)
    }
  }

  request (data: any): Promise<any> {
    return new Promise((resolve, reject): void => {

      data = Object.assign(data, {
        // id: uniqueId(pkg.name + '-'),
        id: Math.random() * 100,
        jsonrpc: JSON_RPC_VERSION
      })

      this._promises.set(data.id, {
        resolve,
        reject,
        method: data.method,
      })
      this._logger.log('ABCWebsocket send data', data)
      this._ws.send(JSON.stringify(data))
    })
  }


  response (msg) {
    try {
      msg = JSON.parse(msg)
      this._logger.log('response msg:', msg)
    }
    catch (err) {
      this._logger.error('response msg parse fail')
      return
    }
  }
}
