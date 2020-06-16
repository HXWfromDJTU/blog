import { BackendApi } from './api'
const config = {
  testServer: 'localhost:12000'
}

const api = new BackendApi({
  url: config.testServer
})

const test = async () => {
  await api.version()
}
