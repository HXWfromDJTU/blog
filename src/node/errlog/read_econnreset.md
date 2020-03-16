### read ECONNRESET

先搬运Google的解释:
> "ECONNRESET" means the other side of the TCP conversation abruptly(突然地) closed its end of the connection. This is most probably due to one or more application protocol errors. You could look at the API server logs to see if it complains about something.

Okay~如上面的解释，出现这种情况是服务端的关闭了连接通道，我们继续排查下Server这边的问题。





### 参考资料
[记一次ECONNRESET的问题排查](https://zhuanlan.zhihu.com/p/35527207)
