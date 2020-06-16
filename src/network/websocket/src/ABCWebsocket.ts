import * as EventEmitter from 'eventemitter3'
import uniqueId from 'lodash-es/uniqueId'
const pkg = require('../package.json')
const JSON_RPC_VERSION = '2.0'

interface IOption {
  url: string
}

export class ABCWebsocket extends EventEmitter {
  protected _serverUrl: string
  protected _channel: WebSocket

  constructor (option: IOption) {
    super()
    this._serverUrl = option.url
    this._channel = new WebSocket(this._serverUrl)
  }

  request (data: any): Promise<any> {
    return new Promise((resolve, reject): void => {
      data = Object.assign(data, {
        id: uniqueId(pkg.name + '-'),
        jsonrpc: JSON_RPC_VERSION
      })
    })
  }
}
