import { ABCWebsocket} from '../ABCWebsocket'
interface IOption {
  url: string
}

class BackendApi {
  protected _url:string
  protected _abcwebsocket: ABCWebsocket

  constructor(option: IOption) {
    this._url = option.url
    this._abcwebsocket = new ABCWebsocket({
      url: this._url
    })
  }

  version () {
    return
  }
}



