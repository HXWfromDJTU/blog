### http与https有什么区别
1. http 的URL 以http:// 开头，https以https:// 开头
2. http 标准端口是80 ，https是443
3. https 协议需要到ca申请证书，http不需要。
4. http 是超文本传输协议，信息是明文传输，https 则是具有安全性的ssl加密传输协议
5. http 的连接很简单,是无状态的，https协议是由SSL+http协议构建的可进行加密传输、身份认证的网络协议 要比http协议安全
#### 优点：
1.  通过证书可以更信任服务器
2.  更安全，防篡改
#### 缺点：
1.  https 需要证书。
2.  因为对传输进行加密，会一定程度增加cpu消耗。
3.  由于https 要还密钥和确认加密算法的需要，所以首次建立连接会慢一些。
4.  带宽消耗会增加。