# Socket
![](/blog_assets/socket_client_server.png)

## 简要理解
* #### 简单定义
   * 网络上的两个程序通过一个双向链接实现数据的交换，这个连接的一段被称之为`socket`。   

   * `socket`的本质是一个编程接口，对TCP/IP进行了封装，`TCP/IP`也要提供可供开发者做网络开发的接口。   

   * 一台主机上多个端口，对应着不同的应用服务，每个服务都打开一个`socket`,并且绑定到一个端口上。   

* #### socket做基础，应用层负责多样性
  * 一台主机就像一个布满插座的房间，有的插座提供的是直流电，有的插座提供的是交流电，有的插座提供的是一个电视信号，用户通过插头插到不同的插座，就可以得到不同的服务。    
  * `HTTP`提供了封装或者显示数据的具体形式，`socket`是发动机，提供了网络通信的能力。    

  ![](/blog_assets/socket.png)   

* #### socket 与 fd
   * `socket` 是一套用于Unix进程间通信的api。`IP + port` 等于网络`socket的地址`   
   * 根据`UNIX`中一切皆是文件的哲学，常规意义的文件、目录、管道、socket都可以看成文件。例如，我们通常也认为`TCP`的`Socket`是一个文件流。
   * `fd`是内核提供给用户安全操作文件的标识，标识符而不像指针，你不能进行修改，只能以当做参数传递给系统不同的api，告知系统该处理哪些文件。写入和读出，也是通过对文件描述符进行`read`和`write`操作。   
    * `Socket` 是一个文件，那对应就有文件描述符。每一个进程都有一个数据结构 `task_struct`，里面指向一个文件描述符数组，来列出这个进程打开的所有文件的文件描述符。文件描述符是一个整数，是这个数组的下标。  
    * `Socket` 对应的文件 `inode`不是保存在物理硬盘上，而是存在于内存中。  

      详细的fd解释，请参考另一篇[笔记]（https://github.com/HXWfromDJTU/blog/issues/12）

* #### 端到端通信
   Socket 是网络层上的一个概念，进行的是端到端的通信。既不能够感知到应用层是什么应用，也不能感知到中间将会经过多少局域网、路由器。因而能够设置的参数只是`网络层`和`传输层`相关的参数。 

   | 传输层协议 | 网际协议版本 | 数据格式 |
   | --- | --- | --- |
   | TCP | IPV4/6 | SOCK_STREAM |
   | UDP | IPV4/6 | SOCK_DGRAM |   

   例如我们熟悉的`nodejs`中创建`socket`连接的参数就能看出 

   ```  
   对于 TCP 连接，可用的 options 有：
       port <number> 必须。套接字要连接的端口。
       host <string> 套接字要连接的主机。默认值: 'localhost'。
       localAddress <string> 套接字要连接的本地地址。
       localPort <number> 套接字要连接的本地端口。
       family <number> IP 栈的版本。必须为 4、 6 或 0。0 值表示允许 IPv4 和 IPv6 地址。默认值: 0。
       hints <number> 可选的 dns.lookup() 提示。
       lookup <Function> 自定义的查找函数。默认值: dns.lookup()。
    ```

   ```
   对于diagram(udp)的 options <Object> 允许的选项是:
       type <string> 套接字族. 必须是 'udp4' 或 'udp6'。必需填。
       reuseAddr <boolean> 若设置为 true，则 socket.bind() 会重用地址，即使另一个进程已经在其上面绑定了一个套接字。默认值: false。
       ipv6Only <boolean> 将 ipv6Only 设置为 true 将会禁用双栈支持，即绑定到地址 :: 不会使 0.0.0.0 绑定。默认值: false。
       recvBufferSize <number> 设置 SO_RCVBUF 套接字值。
       sendBufferSize <number> 设置 SO_SNDBUF 套接字值。
       lookup <Function> 自定义的查询函数。默认值: dns.lookup()。
   ```
   ```js
   // TCP
   var net = require("net");
   var server = net.createServer(function(socket){
       console.log('someone connects');
   })

   // UDP
   const dgram = require('dgram');
   const server = dgram.createSocket('udp4');
   ```

   nodejs - socket 文档传送门   
   [👉 tcp](http://nodejs.cn/api/net.html#net_net_createserver_options_connectionlistener)    
   [👉 udp](http://nodejs.cn/api/dgram.html#dgram_dgram_createsocket_options_callback)



## TCP socket连接场景
根据连接启动的方式以及本地套接字要连接的目标，套接字之间的连接过程可以分为三个步骤：`服务器监听`，`客户端请求`，`连接确认`。

* ### 服务器监听
    * ##### 监听端口
      一般是先调用`bind`函数，给这个`Socket`赋予一个IP地址与端口。
       ```js
       // node.js tcp监听
       server.listen(8000, function(){
        console.log("Creat server on http://127.0.0.1:8000/");
       })
       ```
       监听后，服务器端套接字并不定位具体的客户端套接字，而是处于等待连接的状态，实时监控网络状态。 


* ### 客户端请求
   是指由客户端的套接字提出连接请求，要连接的目标是服务器端的套接字。为此，客户端的套接字必须首先描述它要连接的服务器的套接字，指出服务器端套接字的地址和端口号，然后就向服务器端套接字提出连接请求。     
   
   ```js
     // node.js 创建tcp连接
      const net = require('net');
      const client = net.createConnection({ port: 8124 }, () => {
      // 'connect' 监听器
      console.log('已连接到服务器');
      client.write('你好世界!\r\n');
     });
   ```

* ### 连接确认
     是指当服务器端套接字监听客户端套接字的连接请求，它就响应客户端套接字的请求，建立一个新的线程，把服务器端套接字的描述发给客户端，一旦客户端确认了此描述，连接就建立好了。而服务器端套接字继续处于监听状态，继续接收其他客户端套接字的连接请求。 

    * ##### socket 与 队列
       在内核中，为每个`Socket`维护两个队列
       * 一个是`已经建立连接`的队列，处于`established`状态。
       * 一个是`还没有完全建立连接的队列`，处于`syn_rcvd`的状态。 

    * ##### 监听socket 与 已连接socket
       > 在服务等待的时候，客户端仍可以通过`IP地址`与`端口号`发起连接，并开始三次握手，内核会为其分配一个临时的端口。直到握手成功，服务端使用`accept`函数返回另一个`socket`进行处理。  --- 《趣谈网络协议》

       用于监听的`socket`与用于数据传输的`socket`是两个不同的socket。这里通常称之为`监听socket`与`已连接socket`。


![](/blog_assets/socket_read_write.png)    

 连接一旦建立，双方的`socket`之间的读写`read` 与 `write`就和在一台机器上俩进程之间的读写没有区别，正如一开始说的，`socket`是感知不到中间经过多少路由器和电缆线路的。

发送队列 与 接收队列

## UDP socket连接场景
对于UDP来说，是无连接、无握手过程的，也就不存在了上面👆`TCP连接过程`的`listen`与`connect`。但是其仍需要一个IP和端口号。

* ### 服务端监听
     ```js
     // node.js 使用 dgram 模块启动 UDP 服务
     const dgram = require('dgram');
     const server = dgram.createSocket('udp4');
     
     // 服务器监听 0.0.0.0:41234
     server.bind(41234);
     ```

* ### 客户端连接

   * ##### 无连接
     UDP 是没有维护连接状态的，因而不需要每对连接建立一组 Socket，而是只要有一个 Socket，就能够和多个客户端通信。也正是因为没有连接状态，每次通信的时候，都调用 `sendto` 和 `recvfrom`，都可以传入 IP 地址和端口。
     ```js
     // node.js 客户端通过UDP发送数据
     const dgram = require('dgram');
     const client = dgram.createSocket('udp4');
     const msg = Buffer.from('hello world');
     const port = 41234;
     const host = '255.255.255.255';

     client.bind(function(){
         client.setBroadcast(true);

         // 每次通信，都可以传入 IP 地址 和 端口
         client.send(msg, port, host, function(err){
             if(err) throw err;
             console.log('msg has been sent');
             client.close();
         });
     });
     ```

![](/blog_assets/socket_udp.png)  

## 并发连接问题

### TCP最大连接数
* ##### socket 四元组的限制
  每一个`TCP`可以用一个`四元组`来唯一确定，也就是
  ```
  <source_IP, source_PORT, target_IP, target_PORT>
  ```
  通常服务端启动服务后，`IP`与`Port`就不再变化，但是可以承接`N多个`客户端的请求。这里的N是由`Source_IP`数目`2^32`个，与`port`数目`2^16`个.搭配起来的话就是`2^48`个，但实际上远远达不到。
  > 备注: `IPV_4`下 共有`32`位，则最多`2^32`个。TCP与UDP存储port的字段一共16位，所以最多`2^16`个

* ##### 文件描述符限制
  按照上文的理解，每一个`socket`都被`OS`当做一个文件处理，那么就有存在`打开文件数`的限制。

  ```bat
  # 查看最大打开文件数
  $ ulimit -n

  # 设置最大打开文件数
  $ ulimit -n <file-num>
  ```
  这里的`-n`参数标明修改的是`单个进程可以打开的文件数`     

  其他的参数这里也一并简单了解一下[(参考文档👉)](https://www.runoob.com/linux/linux-comm-ulimit.html)

  ```bat
     数据段长度：ulimit -d unlimited
     最大内存大小：ulimit -m unlimited
     堆栈大小：ulimit -s unlimited
     CPU 时间：ulimit -t unlimited
     虚拟内存：ulimit -v unlimited    
  ```

* ##### 内存的限制
  每一个`socket`都有对应的`inode`存储在内存中，然而计算机的内存是有限的。


### 解决办法

* ##### 创建多进程
  `Linux`创建一个子进程的操作称为`fork`, 进程复制的主要涉及几样东西
     * 把文件描述符列表全部拷贝一遍。
     * 也会复制内存空间。
     * 复制当前代码执行的位置。
 
  执行了`fork`后，父子进程理论上是完全一样的。仅能通过`fork`返回值来区分，自己到底是`父进程`还是`子进程`。     

  ```js
    // node 创建子进程的命令
    const cp = require('child_process')

    // 启动子进程来执行命令
    cp.spawn('node', ['index.js'])
    // 启动了子进程，并通过回调获得信息
    cp.exec('node index.js', (err, studio, stderr) => {
        // get some message
    })
    // 启动子进程来执行可执行文件
    cp.execFile('index.js',  (err, studio, stderr) => {
        // get some message
    })
    // 仅需指定执行文件模块
    cp.fork('index.js')
  ```
* ##### 创建多线程
  进程的创建与销毁开销过大，则可以考虑使用轻量级得多的`多线程`，区别在于
  * 共用文件描述符
  * 共用进程空间
  * 新的连接也可以直接通过`已连接`的socket来处理请求，从而达到并发表处理的目的。

  ```js
  const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

  return new Promise((resolve, reject) => {
      const worker = new Worker(__filename, {
        workerData: script
      });
      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0)
          reject(new Error(`Worker stopped with exit code ${code}`));
      });
    });
  ```
  示例代码使用`node`的`worker_threads`，感兴趣的推荐[这篇文章👉](https://blog.skk.moe/post/say-hello-to-nodejs-worker-thread/) 

* ##### I/O 多路复用
  无论多么厉害的一台机器，同时维护超过`1w`个进程，OS是无法承受的，这就是常说的`C10K`问题。此时`I/O`多路复用就出现了。有以下优点：
    * 使用监听的形式，Socket 数据增加的时候，效率不会大幅度降低
    * 能够同时监听的 Socket 的数目能达到系统定义的、进程打开的最大文件描述符个数

  更多关于多路复用的问题，请关注[另一篇笔记👉](https://github.com/HXWfromDJTU/blog/issues/13)


## 参考文章
[趣谈网络协议 - 套接字Socket](https://time.geekbang.org/column/article/9293)

IPC 进行通信？

C10K 一台机器要创建10K个链接，一亿个用户要10W台服务器
I/O多路复用，项目进度墙

I/O多路复用

epoll注册callback，某个文件描述符发生了变化
epoll函数

红黑树、平衡二叉树  随着输的节点更多，但是树的结构不会变得特别深   epoll entry 


服务端最大的连接数是 2的48次方   

fd_size  

win:IOCP

linux:epoll  通过callback的机制通知，可以突破最大文件描述符的限制  解决C10K问题的利器  




UDP 
sendTo receiveFrom 

客户端的IP数目 X 客户端的端口数目


创建子进程 fork 完完全全复制一个主进程，文件描述符的列表，内存空间，一条记录（指明当前执行到那一行）
