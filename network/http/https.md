# HTTPS加密流程
![](/blog_assets/https_cover.png)
___
### what is https
1️⃣ `https` 全称 `(Hyper Text Transfer Protocol over Secure Socket Layer)`，也就是在原`http`协议下，添加`SSL(Secure Socket Layer)`层
2️⃣ `https`最大的亮点就是`SSL`层加对数据的加密

### why use https?
> 💸 从原来的`http`协议缺点来看：

1️⃣ `明文传输`   
传输的时候使用`明文`传参，极其容易被第三方截取。https使用的是加密传输。 
2️⃣ `MITM中间人冒充服务器`
没有访问发起者的身份认证机制，第三方即可以十分容易地使用终端发起大量伪请求。   
3️⃣ `报文容被篡改`     
报文段被部分篡改，http服务器端也无法识别。    
   

##### HTTPS 与 HTTP的不同点
1️⃣ `http` 的`URL` 以`http://` 开头，`https`以`https://` 开头
2️⃣ `HTTP`采用的是明文传输，而`HTTPS`使用的是`SSL\TSL`进行加密传输
3️⃣ `HTTP`的默认端口是`80`，而`HTTPS`的默认端口是`443`
4️⃣ `HTTPS` 需要`CA`证书，`http`不需要。
5️⃣ http 的连接很简单,是无状态的，`https`协议是由`SSL+http`协议构建的可进行加密传输、身份认证的网络协议 要比`http`协议安全


##### 对称加密 和 非对称加密
1️⃣ 非对称加密中`公钥`加密只有私钥可以解开，`私钥`加密只有公钥能够解开。
2️⃣ 对称加密速度快，可以加密的信息量较大
3️⃣ 非对称加密算法复杂，加密解密速度慢，一般用于少量信息加密
  
##### https的劣势
1️⃣ 因为加密的需要，常见的三握手就要多几个来回，要还密钥和确认加密算法的需要，所以首次建立连接会慢一丢丢。(但是相较于安全性来说，是值得的)
并且使用http2.x之后，tcp的复用，会大大减少握手带来的消耗。   
2️⃣ 因为对传输进行加密，会一定程度增加cpu消耗，相同负载下会增加带宽和服务器投入成本。     
3️⃣ 功能越强大的证书就越贵，加大了项目的投资成本。     
4️⃣ 在某些政治或者其他原因下，CA公司信息泄露，那么SSL的证书安全就无从谈起。     

##### `SSL`与`TSL`

1️⃣ `SSL`（Security Socket Layer）是一种广泛运用在互联网上的资料加密协议；`TLS`是`SSL`的下一代协议。  
2️⃣ `SSL`证书 (Certificate) 像身分证一般可以在互联网上证明自己的身份。在资料的加密传输开始之前，服务器透过“有效”的`SSL`证书告诉用户端自己是值得信赖的服务器  
3️⃣ 目前`SSL`大部分是收费的，但是自己生成的`SSL`证书又不能被浏览器所信任，即不安全。

### 前提工作  
> 本段中(A与A'，B与B')表示两对非对称加密的公钥和私钥。

1️⃣  服务端会将准备永福通信加密的公钥(A)送到权威证书机构(CA)，CA会用一个证书将这把送过来的公钥(A)使用非对称私钥(B')进行加密。          
![](/blog_assets/FF_CERTIFICATE.png)
2️⃣ 权威机构也会在客户的操作系统中预先安装证书，里面存放着该机构的公钥(B)，用于验证服务器发过来的证书是否合法。   
3️⃣ 这里还有一个服务端私钥(A'),会在传输`pre-master`中用到。            

### SSL\TSL 握手流程

#### 1️⃣ Client Hello 
> 客户端向服务器发送准备链接的信息(相当于打招呼), 并且告诉服务器自己支持哪些加密套件
##### 参数：
  * 随机数 Random1
  * 客户端支持的加密套件（Support Ciphers）

![client_hello](/blog_assets/client_hello.png)


#### 2️⃣ Server Hello 
> 服务器响应 客户端的打招呼，返回包括 
##### 参数 
   * 服务器从客户端发过来的套件中，选择了具体的一个加密套件 
   * 随机数 `Random2`

 ![client_hello](/blog_assets/server_hello.png)

#### 3️⃣ Certificate
> 这一步是服务端将自己的证书下发给客户端，让客户端验证自己的身份，客户端验证通过后取出证书中的公钥。
##### 参数
* (服务端 ==>  客户端 )证书
* 客户端取出证书中的公钥

![证书](/blog_assets/certificate.jpg)

#### 4️⃣ Certificate Request & Server Hello Done
> Certificate Request 是服务端要求客户端上报证书（可选）

> Server Hello Done 通知客户端 Server Hello 过程结束


#### 5️⃣ Certificate Verify 
* 客户端收到服务端的证书，使用CA机构在客户端中内置的证书公钥尝试解开证书，若不能解开，则说明证书不是真正的服务器发出的，或者证书被篡改过。   
 
* 若验证通过(解得开证书)，则取出证书中的服务端公钥，准备用于非对称加密`pre-master`。


注意：这里若证书合法性验证失败，则会告知用户改证书有风险。 

![](/blog_assets/certificate_error.png)
<!-- ![key](/blog_assets/key_exchange.png)  -->

#### 各自生成对称加密套件 & Client Key Exchange  
* 再用服务端公钥(非对称加密) 对`Random3`加密，生成 `pre-master`。并发送给服务端
双方都使用之前生成的(random1 + random2 + pre-master)生成了一个第一无二的加密套件，接下来准备开始，双方使用独一无二的加密套件，进行测试加密传输。
（⭕️ 记住咯，这个公钥不会被任何一次请求发送到网络上）  

#### 6️⃣ Change Cipher Spec & Encrypted Handshake Message （客户端测试加密连接）
> 首先是客户端通知服务端后面再发送的消息都会使用前面协商出来的秘钥加密了，是一条事件消息。

> 再是客户端将前面的握手消息生成摘要再用协商好的秘钥加密，这是客户端发出的第一条加密消息。

![key](/blog_assets/clicent_check.png)


#### 7️⃣ Change Cipher Spec & Encrypted Handshake Message （服务端测试加密连接）
>首先是服务端通知客户端后面再发送的消息都会使用加密，也是一条事件消息

>再是服务端也会将握手过程的消息生成摘要再用秘钥加密，这是服务端发出的第一条加密消息

![](/blog_assets/server_check.png)
   * 使用加密套件的私钥进行解密，获得随机数
   * 服务端使用对称加密算法，对获取到的随机数进行对称加密，得到“指定加密算法” + “随机生成数” 结合的一个特殊令牌
   * 服务器使用这个令牌加密需要保护的内容主体，一并发送给客户端
   
#### 8️⃣ 正式发送加密数据 
使用各自生成的对称秘钥`public key`正式进行对称加密数据传输。
___
##### 握手过程优化
并不是每一次的传输都需要进行这么繁杂的握手过程，每隔一定的时间才回进行重新SSL握手。
首次的`client hello`就附带了上一次的`session ID`,服务端接受到这个session  ID,若能够复用则不进行重新握手。
![](/blog_assets/https_sessionId.png)   

##### 整体优化    
2️⃣ 使用http2.0与https结合，加入多路复用、服务端推送等优势。        
1️⃣ 直接使用SPDY，[博文传送门👉](/network/http/spdy.md)


___
### 总览
![https](/blog_assets/https_handshakes.jpg)


___
### 参考文章
[SSL/TLS 握手过程详解]()
[从http 到 https项目迁移](/network/http/https_onwork.md)   
[IEEE 802.1X-PEAP认证过程分析（抓包）](https://blog.csdn.net/u012503786/article/details/79296522)


