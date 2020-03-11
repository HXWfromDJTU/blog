let os = require('os');

// 获取主机名称
console.log(os.hostname()) 


// 获取平均负载
console.log(os.loadavg()) 
/*
平均负载是系统活动的测量,由操作系统计算得出,表达为一个分数.
 一般来说,平均负载应该理想地比系统的逻辑CPU的数目要少. 
 平均负载是UNIX相关的概念,在Windows平台上没有对应的概念. 
 在Windows上,其返回值总是[0, 0, 0].
*/

// 方法返回一个对象,包含只有被赋予网络地址的网络接口. 
console.log(os.networkInterfaces())


// 返回运行所在的操作系统
console.log(os.platform() + ' ' + os.release())


//console.log(os.tmpdir());

console.log('所有内存中的字节数:'+ os.totalmem()+'byte , 也就是'+os.totalmem()/1024/1024/1024+'G')

// OS信号常量

console.log(os.constants)

// 错误常量

console.log(os.constants.errno)