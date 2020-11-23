# 进击的http2
![](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/blog_assets/http2_cover.png)

## 单一长链接
### 1. 减少tcp握手次数，减少RTT
在请求的资源很多的情况下，`http1.x`是会同时打开`6~8`个`tcp`链接，所以我们在前端机操作的时候，就有了压缩合并css/js资源，使用雪碧图这样的优化方案。   

而http2使用单一的`长链接`去加载所有资源。有效地减少了`tcp`握手所带来的时延,特别是当请求使用了`ssl`加密请求时，握手次数会大大增加。    
  

![](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/blog_assets/http2_multiplex_1.png)

![](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/blog_assets/http2_multiplex_2.png)

![](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/blog_assets/timeline_detail.png)     

结合上面图说明，`http2.0` 可以同时对多个资源进行请求，不受 `6~8` 链接的限制，图中看出，服务器接收到请求的时间是一样的，而根据不同的资源做出的响应时间长度不一样而已。      

### ❓ 题外话：为啥浏览器要限制 6~8 个链接呢？

1. 浏览器所在的操作系统，对半开连接数有限制，用于保护 `TCP/IP` 协议栈资源不被迅速消耗殆尽。所以浏览器不会同时发送过多的 `tcp` 链接     

2. 浏览器操作启动一个 `tcp` 链接都需要一个开启一个线程，若同时创建过多线程，性能会下降的很严重。而综合考量 6~8 个 tcp 链接(线程)，并且在 `http 1.1` 下的`keep-alive` 机制，这些链接(线程)是可以被复用的，减少开销。      

3. 对于服务器来说，同时能够接受的请求数目也是有限的。这时候，作为一个 `client`，不进行作恶就很关键了，作恶你就和恶意程序没有区别了。所以浏览器是选择性的减少同时连接的数目。                

### 2️. 减少慢启动时间
每次的`TCP`链接，都会涉及到一个慢启动过程，也就是连接建立之后，数据线是慢慢地传，然后数据窗口再慢慢地增大，传输速度才达到稳定峰值。

而`http2`减少`tcp`的连接数为`1`次，大大减少了冷启动的滑动窗口的次数。

## 多路复用     
### 1. FIFO 与 穿插发送   
`HTTP 2.0` 把每一个资源的传输叫做流 `Stream`，每一个流都有他的唯一 `id` 称之为stream ID。

每一个流就像是一批货物，都有自己的编号，每个数据流最后都被切分为数据帧(frame)。同一种货物(最后要拼装在一起的不同`frame`)要遵循 `FIFO` 的原则去传输，但是不同种货物之间，可以相互穿插，先后出发。  

###### `流id的是递增的` 
已关闭的流的编号在当前连接不能复用，避免在新的流收到延迟的相同编号的老的流的帧。所以流的编号是递增的。

![多路复用](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/blog_assets/HTTP2_data_frame.png)     

### 2. 数据被切分成`frame`传输   
若把每次建立 `TCP` 连接，称之为修路的话，那么 `http2` 则只修了一条路，然后把不同文件请求的 `data` 切分为多个二进制 `Frame`，头部信息放在 `HEADER FRAME`,数据体存放在 `data Frame` 中，装在不同的的货车上，然后让他们同时在修好的道路上跑，充分利用了道路的宽度，也充分利用了现有的宽带带宽。  

##### 帧的格式  
![](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/blog_assets/http2_frame.png)   

##### 帧的分类
HTTP/2规定了多种类型的帧    
| 名称 类型 | 帧代码 | 作用 |
| ------ | ------ | ---  |
| DATA | 0x0 | 一个或多个DATA帧作为请求、响应内容载体|
| HEADERS | 0x1 | 报头主要载体，请求头或响应头，同时呢也用于打开一个流，在流处于打开"open"或者远程半关闭"half closed (remote)"状态都可以发送。|
| PRIORITY | 	0x2 |表达了发送方对流优先级权重的建议值，在流的任何状态下都可以发送，包括空闲或关闭的流。 |
| RST_STREAM | 0x3	 |表达了发送方对流优先级权重的建议值，任何时间任何流都可以发送，包括空闲或关闭的流。 |
| SETTINGS | 0x4	 | 设置帧，接收者向发送者通告己方设定，服务器端在连接成功后必须第一个发送的帧。 |
| PUSH_PROMISE | 0x5	 | 服务器端通知对端初始化一个新的推送流准备稍后推送数据|
| PING | 0x6	 | 优先级帧，发送者测量最小往返时间，心跳机制用于检测空闲连接是否有效。 |
| GOAWAY | 0x7	 | 一端通知对端较为优雅的方式停止创建流，同时还要完成之前已建立流的任务。|
| WINDOW_UPDATE | 0x8	 | 流量控制帧，作用于单个流以及整个连接，但只能影响两个端点之间传输的DATA数据帧。但需注意，中介不转发此帧。|
| CONTINUATION | 0x9	 | 用于协助HEADERS/PUSH_PROMISE等单帧无法包含完整的报头剩余部分数据。|
 	

### 3️.不同类型文件，不同优先级下载 
针对不同类型的资源，HTTP2 进行了不同程度的优先传输。比如页面传输中的，`script`和`link`会被优先传输，而类似于图片这种较大的文件优先级则降低。


## 压缩头部
### 1. 减少明文header使用
在 http1.x 中，我们可以直接在报文中看到报文头的内容，便于开发人员调试。但随着https 的普及，SSL 加密传输也是 `plain text` 变成了二进制，明文调试也不存在。   
![](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/blog_assets/http2.0_helloworld.png)  
上图是我们尝试发送一个 `hello world` 字符串，整个数据体加上报文头，一共超过了300个字符，浪费了很多的大小     

### 2. 静态索引表，标记常见`header`内容
HTTP使用HPACK压缩来说压缩头部，减少了报文的大小。具体实现是将报文头中常见的一些字段变成一个索引值`index`，也就是维护一张静态索引表，例如把`method:POST`，`user-agent`，协议版本等，对应成一个`index`值。
静态索引表是固定的。    

浏览器下的系统目录下的 `http2.0` 静态表格

![](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/blog_assets/http2_STATIC_TABLE.png)  
静态表格一共有61个常用字段搭配。

### 3.动态索引表，逐步建立
动态索引表功能类似于静态索引表，动态索引表的索引存放在静态索引表中。请求发现了新内容，则在动态索引表中建立新的索引。  

那么我们的动态表格的索引，就从 62 开始计算。有新字段增加，就用最小的索引去记录它，而不是使用大的索引。   

```cpp
table_.push_front(entry);
```

### 4. huffman压缩
对于经常变化的内容，类似于“资源路径”，`HPACK`压缩则使用`Huffman`编码进行压缩。  

因为请求的文件过大，超过一个`TCP`报文时，会被分成几个`TCP`报文进行传输，压缩能够有效的减少TCP传输的数目。

压缩规范格式为
```cpp
key长度 + key + value长度 + value
```

比如 `Method:OPTION`可以被翻译压缩为：
```cpp
0206 6a6b 6f64 6a69
```

## 服务端推送 Server push
### 1.“缓存推送”
在客户端请求想服务端请求过一个资源"A"后，而服务端"预先"知道，客户端很有可能也会需要另一个资源"B"。
那么服务端就会在客户端请求“B”之前，主动将资源“B”推送给客户端    
```bat
## nginx 配置文件
location = /html/baidu/index.html {   ## 表示在访问这个地址的时候
    # 主动向客户端推送以下资源   
    http2_push /html/baidu/main.js?ver=1;
    http2_push /html/baidu/main.css;
    http2_push /html/baidu/image/0.png;  
    http2_push /html/baidu/image/1.png;  
    http2_push /html/baidu/image/2.png;
    http2_push /html/baidu/image/3.png;
    http2_push /html/baidu/image/4.png;
    http2_push /html/baidu/image/5.png;
    http2_push /html/baidu/image/6.png;
}
```    
根据上图的配置，客户端请求 `/html/baidu/index.html`  页面的时候，服务器不会马上返回页面的信息，而是首先将所配置资源以数据帧的形式，与客户端建立多条Stream。  
这样可以有效减少资源所需的响应时间，而浏览器收到服务器的主动推送，就可以直接进行下载阶段。

### 2️.客户端许可推送
“缓存推送”需要客户端显式地允许服务端提供该功能。即使允许了“主动推送”，客户端仍能够传送 "RST_STREAM" 帧来终止这种主动推送服务。   

### 3.CDN Server Push
事实上呢，线上服务的静态资源都是托管于 CDN 的，想要享受 Server Push 的福利只能依赖于 CDN 服务商支持 Server Push 的功能。

参考 [又拍云 CDN - Server Push 配置详解](https://www.upyun.com/tech/article/294/%E8%AE%A9%E4%BA%92%E8%81%94%E7%BD%91%E6%9B%B4%E5%BF%AB%EF%BC%8CServer%20Push%20%E7%89%B9%E6%80%A7%E5%8F%8A%E5%BC%80%E5%90%AF%E6%96%B9%E5%BC%8F%E8%AF%A6%E8%A7%A3.html)

## 小结
1. 使用单一的长链接，减少SSL握手的开销    
2. 头部被压缩，减少了数据传送量    
3. 多路复用，将数据切分成`frame`，充分利用带宽    
4. 不用像 `http1.x` 时代，强行将多个文件杂糅到成一个文件，分文件请求，使得`文件缓存`更有效命中。       

![多路复用](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/blog_assets/http2_youdian.jpg)


## 参考文章
[1] [HTTP 2 的新特性你 get 了吗？](https://zhuanlan.zhihu.com/p/26433450)   

[2] [从Chrome源码看HTTP/2](https://juejin.im/post/5aad47b1f265da23884cd5cb)  

[3] [HTTP2 帧的分类](https://blog.csdn.net/makenothing/article/details/53241399)   

[4] [从Chrome源码看http2.0](https://juejin.im/post/5aad47b1f265da23884cd5cb)  

[5] [http2.0优先级](http://www.cnblogs.com/Yanss/p/10193378.html)         

[6] [Node HTTP/2 Server Push 从了解到放弃](https://juejin.cn/post/6844903599655370759?hmsr=joyk.com&utm_source=joyk.com&utm_source=joyk.com&utm_medium=referral%3Fhmsr%3Djoyk.com&utm_medium=referral)    

[7] [Exploring Differences Between HTTP Preload vs HTTP/2 Push](https://www.keycdn.com/blog/http-preload-vs-http2-push)