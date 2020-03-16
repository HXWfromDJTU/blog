### 

异常截图
![](/blog_assets/read_ECONNR.png)

#### nodejs文档中该错误的说明
```
Common System Errors

ECONNRESET (Connection reset by peer): A connection was forcibly closed by a peer. This normally results from a loss of the connection on the remote socket due to a timeout or reboot. Commonly encountered via the http and net modules.
```
连接突然被另一端直接关闭了，通常是因为远端(服务器)超时或者重启，而导致的socket连接丢失，常常出现在`http`和`net`模块中。(和 Google 提供的简单描述差不多)

### 参考资料
[nodejs官方文档 - Error](https://nodejs.org/api/errors.html)