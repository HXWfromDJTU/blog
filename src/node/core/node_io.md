# Node 异步 I/O 实现
![](/blog_assets/node_libuv.png)
___
## Linux下实现
* NIO意思是Non-Blocking I/O,非阻塞I/O的意思，与之相对应的是BIO(阻塞性I/O)  
* Linux NIO的几种类型 `select` `select/poll`  `epoll`   
* 在linux 下 ，最多同时连接的文件描述符默认是 1024个
![](/blog_assets/linux_FD_SETSIZE.png)  
## 文件描述符
* 操作系统对计算机进行了抽象，将所有的输入输出设备都抽象为文件。
* 内核在进行文件操作的时候，通过文件描述符进行管理，文件描述符类似于应用程序与系统内核之间的凭证。   
* 应用程序要进行I/O调用，需要先打开文件描述符，然后再根据文件描述符去实现文件数据的读写。  
* 阻塞I/O与非阻塞I/O的的区别在于，阻塞I/O直接完成整个数据读取的过程，而非阻塞I/O请求后不带值返回，需要去获取结果的时候，还需要再次使用文件描述符进行获取。 
> 摘自《NodeJS深入浅出》 

## 三种NIO异同点
* `select` `poll` `epoll`都是I/O多路复用的一种机制。  
* 可以监视多个描述符，一旦某个描述符就绪（一般是读就绪或者写就绪），能够通知程序进行相应的读写操作。
* 三者本质上都是同步的I/O,因为他们都要在读写事件就绪之后，自己负责读写操作。  

## select 

##### 过程
  * 从用户空间拷贝`fd_set`到内核空间  
  * 注册`__pollwait函数`，I/O操作的过程中,当前进程就被挂在等待队列中，直到操作完成,当前进程就再次被释放出来  
  * 遍历fd_set中所有的文件描述符，然后调用其对应的各种`socket_poll方法`，进而根据情况调用`tcp_poll`,`udp_poll`或者`datagram_poll`。     
  * 再次把fd_set拷贝回用户空间 

##### 缺点 
  * 每次调用select的时候，都需要把fd_set(所有的文件描述符)c通用户状态拷贝到内核中，过程中还存在这个一个遍历fd_set内的所有文件描述符的工作，`若fd_set很大的时候，操作开销会特别大`。   
  * select支持的文件描述符数量太小了，默认才1024个  
  * 时间复杂度O(n)  

## poll
 * `poll`机制和`select`运行的机制上没有区别，但是`poll`是基于l链表来存储的文件描述符，所以没有最大连接数的限制。
 * 时间复杂度O(n)

## epoll
`epoll`既然是以上两种方案的改进版，自然没有以上方案的缺点。 
* ##### 提供了三个api
  * `epoll_create`:用于创建一个epoll句柄
  * `epoll_ctl`:用于注册要监听的事件类型   
  * `epoll_wait`:则是等待事件的发生  

##### 缺点的改进 
* 事件的监听机制使得，文件描述符在epoll创建的时候就全部被拷贝了一次，而后续的等待阶段那就不需要再进行`重复拷贝`  
* epoll_wait的工作就是在这个就绪链表中查看有没有就绪的文件描述符(与前二者区别在于，只要检查就绪列表是否为空，而前二者都需要重复不断遍历所有的文件描述符，检查是否有就绪的)  
* epoll所支持的最大的文件描述符数量，等于最大可以打开文件的数目，这个数目一般远大于2048，对应1GB内存的机器，大约可以打开10w个链接，和系统的内存大小很有关系。




## window下的IOCP 
" 那么在Windows平台下的状况如何呢？而实际上，Windows有一种独有的内核异步IO方案：IOCP。IOCP的思路是真正的异步I/O方案，调 用异步方法，然后等待I/O完成通知。IOCP内部依旧是通过线程实现，不同在于这些线程由系统内核接手管理。IOCP的异步模型与Node.js的异步 调用模型已经十分近似。"

>以上文字摘自《异步I/O - NodeJS深入浅出 第三章》

## 归纳  
* ICOP是window平台下，操作系统级别的异步I/O实现方案 
* 与epoll+libuv 的方案相类似，都是使用线程去实现的 

## 参考文章
[1] [select、poll、epoll之间的区别总结[整理]](https://www.cnblogs.com/Anker/p/3265058.html)  
[2] [Java 与 NIO](https://www.cnblogs.com/personnel/p/4583279.html)  
[3] [《异步I/O - NodeJS深入浅出 第三章》]()
[4] [IO模型及select、poll、epoll和kqueue的区别](https://www.cnblogs.com/moonz-wu/p/4740908.html)

<link rel="stylesheet" href="../../config/global.css"/>

