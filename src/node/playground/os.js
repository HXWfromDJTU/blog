const os = require('os')

const apiMap = {
  'os.EOL': os.EOL,
  'os.arch': os.arch(),
  'os.cups': os.cpus(),
  'os nums': os.cpus().length,
  'os.endianness': os.endianness(),
  'os.freemem()': os.freemem(), // 返回系统空闲内存的大小, 单位是字节
  'os.totalmen': os.totalmem(),
  'os.homedir()': os.homedir(), // 返回当前用户的根目录
  'os.hostname': os.hostname(), // 返回当前系统的主机名
  'os.loadavg': os.loadavg(), // 返回负载信息
  'os.networkInterfaces': os.networkInterfaces(), // 返回网卡信息 (类似 ifconfig)
  'os.platform': os.platform(), // 返回编译时指定的平台信息, 如 win32, linux, 同 process.platform()
  'os.release': os.release(), // 返回操作系统的分发版本号
  'os.tmpdir': os.tmpdir(), // 返回系统默认的临时文件夹
  'os.type': os.type(), // 返回系统名称
  'os.uptime': os.uptime(), // 返回系统的运行时间，单位是秒
  'os.userInfo': os.userInfo(), // 返回当前用户信息
  'os.constants.errno': os.constants.errno
}

Object.keys(apiMap).forEach(key => {
  console.log(key, ':', apiMap[key])
})
