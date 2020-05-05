const v8 = require('v8')

const apiMap = {
  'v8.getHeapStatistics': v8.getHeapStatistics(),
  'v8.getHeapSpaceStatistics': v8.getHeapSpaceStatistics()
}

Object.keys(apiMap).forEach(key => {
  console.log(key, ':', apiMap[key])
})
