# tcp modules

### net.Server类
net 模块用于创建基于流的 TCP 或 IPC 的服务器（net.createServer()）与客户端（net.createConnection()）。




### net.Socket类
这个类是 TCP 或 UNIX Socket 的抽象（在Windows上使用命名管道，而UNIX使用域套接字）。一个net.Socket也是一个duplex stream，所以它能被读或写，并且它也是一个EventEmitter。

net.Socket可以被用户创建并直接与server通信。举个例子，它是通过net.createConnection()返回的，所以用户可以使用它来与server通信。

当一个连接被接收时，它也能被Node.js创建并传递给用户。比如，它是通过监听在一个net.Server上的'connection'事件触发而获得的，那么用户可以使用它来与客户端通信。


### 发送端
net.createConnection
可以创建多种链接：1️⃣ TCP链接 2️⃣ IPC连接