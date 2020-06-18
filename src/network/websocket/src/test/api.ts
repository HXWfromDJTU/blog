import { ABCWebsocket} from '../ABCWebsocket'
const JSON_RPC_VERSION = '2.0'

interface IOption {
  url: string
}

export class BackendApi {
  protected _url:string
  protected _abcwebsocket: ABCWebsocket

  constructor(option: IOption) {
    this._url = option.url
    this._abcwebsocket = new ABCWebsocket({
      url: this._url
    })
  }

  version () {
    return this._abcwebsocket.request({
        data: null
    })
  }
}



