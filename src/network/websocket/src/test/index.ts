import { BackendApi } from './api'
const config = {
  testServer: 'ws://121.40.165.18:8800'
}

const api = new BackendApi({
  url: config.testServer
})

const test = async () => {
  await api.version()
}
