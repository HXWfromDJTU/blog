const os = require('os');

// cpu核心数
const length = os.cpus().length;

// 单核CPU的平均负载
const res = os.loadavg().map(load => load / length);


console.log(length)

console.log(res)

