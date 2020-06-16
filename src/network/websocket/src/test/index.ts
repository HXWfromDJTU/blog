import { BackendApi } from './api'
const config = {
  testServer: 'ws://localhost:12000'
}

const api = new BackendApi({
  url: config.testServer
})

const test = async () => {
  await api.version()
}
