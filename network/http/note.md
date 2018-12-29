# 

URL 统一资源定位符 
163.com是域名

HTTP是基于TCP的

http1.1是默认打开keep-alive的

### header
![](/blog_assets/http_header.png)


POST 创建一个资源   PUT一般用于修改一个资源

Cache-control  If-Modify-Since  用于制作缓存

HTTP是基于TCP的，是通过Stream的，超时重发和http无关，都是TCP负责

![](/blog_assets/http_response_header.png)
### http2.0

### QUIC
自定义连接机制、自定义重传机制、无阻塞的多路复用、自定义的流量控制。  
QUIC 协议通过基于 UDP 自定义的类似 TCP 的连接,重试、多路复用、流量控制，进一步提升性能。  

在TCP中，接收端的窗口的起点试下一个要接收并且ACK的包，即便后来的包都已经被接收到了，也不能够发送ACK，所有在前面的包没有到的情况下，后面的数据包虽然到了，但是也有超时重传的风险。




##### 网关
网关是一种特殊的服务器，面对客户端时好像它就是服务器，而对于服务器，他又充当客户端的角色，它的主要作用是协议转换！例如HTTP/FTP网关。

##### 隧道
就是一个连接通道，用于在http信道上发送非http协议的资源。

