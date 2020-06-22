import * as EventEmitter from 'eventemitter3'
const uniqueId = require('lodash.uniqueid');
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

interface IResponse {
  id: string,
  jsonrpc: string,
  method: string,
  data: any,
  errCode: number,
}

interface IRequest {
  id: string,
  jsonrpc: string,
  method: string,
  data: any
}

// todo: error code 拆分
export enum ErrorCode {
  SUCCESS = 0
}

// websocket的几个状态
enum WEBSOCKET_STATE {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}

export class ABCWebsocket extends EventEmitter {
  protected _serverUrl: string // 远端地址
  protected _ws: WebSocket // 原生ws实例
  protected _promises: Map<string, IPromise> // 请求哈希表
  protected _logger: Console // 日志工具
  protected _waitingQueue: Array<any> // websocket状态异常、未建立的时候，存储请求

  constructor (option: IOption) {
    super()
    this._serverUrl = option.url
    this._ws = new WebSocket(this._serverUrl)
    this._logger = option.logger || console
    this._waitingQueue = []
    this._promises = new Map()

    this._ws.onmessage = event => {
      console.log(event.data)

      // 简单的检测过后，进行相应处理
      if (event.data && typeof event.data === 'string' && event.data.includes(JSON_RPC_VERSION)) {
        this.response(event.data)
      }
    }

    this._ws.onopen = event => {
      this._logger.log(`ABCWebsocket connected to ${this._serverUrl} successfully......`)

      // ws通道联通后，发送前期未发送的请求(缓存队列中的请求，都已经注册登记过了，所以不需要再次登记)
      this._waitingQueue.forEach(payload => {
        this._ws.send(this._toDataString(payload))
      })
    }
  }

  request (data: any): Promise<any> {
    return new Promise((resolve, reject): void => {

      const payload = Object.assign(data, {
        id: uniqueId(pkg.name + '-'),
        jsonrpc: JSON_RPC_VERSION
      })

      // 登记请求
      this._promises.set(data.id, {
        resolve,
        reject,
        method: payload.method,
      })

      // 若ws连接达成，则先缓存请求
      if (this._ws.readyState === WEBSOCKET_STATE.CONNECTING) {
        this._waitingQueue.push(payload)
        return
      }

      this._logger.log('ABCWebsocket send data', data)

      // 发送请求
      this._ws.send(this._toDataString(data))
    })
  }


  response (msg: string) {
    try {
      const res: IResponse = JSON.parse(msg)

      this._logger.log('response msg:', msg)


      const promise: IPromise = this._promises.get(res.id)

      // todo: 删除处理过的promise
      this._promises.delete(res.id)
      this._logger.log('ABCWebsocket delete the promise, id=', res.id)

      // todo: 根据errno决定执行哪一个reject还是resolve
      if (res.errCode !== ErrorCode.SUCCESS) {
        promise.reject(res.errCode)
      }
      else {
        promise.resolve(res.data)
      }
    }
    catch (err) {
      this._logger.error('response msg parse fail')
      return
    }
  }

  _toDataString(data: any) {
    try {
      return JSON.stringify(data)
    } catch (err) {
      this._logger.error('ABCWallet Stringify data error')
    }
  }
}
