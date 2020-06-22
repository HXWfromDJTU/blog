import { BackendApi } from './api'
const config = {
  testServer: 'ws://121.40.165.18:8800',
  thingubgServer: 'ws://achex.ca:4010',
  okeyServer: 'wss://real.okex.com:8443/ws/v3?brokerId=9999',
  huobi: 'wss://api.huobi.pro/ws',
  huobiAWS: 'wss://api-aws.huobi.pro/ws',
  binanceApi: 'wss://fstream.binance.com',
  localServer: 'ws://localhost:3000/events'
}

const OKEX_API = {
  apiKey: 'd782f728-46ba-4196-92b0-f2b40b802e50',
  secretKey: 'F64BEB6A286DDB195D19BF44E31EB719',
}
const api = new BackendApi({
  url: config.localServer
})

const test = async () => {
  const res = await api.version()
  console.log('接口返回的数据', res)
}

setTimeout(test, 3000)

