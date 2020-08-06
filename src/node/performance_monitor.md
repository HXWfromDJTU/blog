# Node 性能监控

## CPU 负载


#### 平均负载
在`nodejs`这里的操作是，使用`os.loadavg()`测试出`1`、`5`、`15`分钟的负载

```js
const os = require('os');

// cpu核心数
const length = os.cpus().length;

// 单核CPU的平均负载
os.loadavg().map(load => load / length);
```


在 1973 年 8 月的 RFC 546 中对 Load average 有一个很好的描述

>[1] The TENEX load average is a measure of CPU demand. The load average is an average of the number of runnable processes over a given time period. For example, an hourly load average of 10 would mean that (for a single CPU system) at any time during that hour one could expect to see 1 process running and 9 others ready to run (i.e., not blocked for I/O) waiting for the CPU.
