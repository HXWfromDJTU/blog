* UDP (优化补充原有文章)
   * DNS 是基于UDP 还是基于 TCP
   * OS 级别的DNS 缓存在哪里？在什么目录下？以什么形式存在？
   * nginx 中的 resolver 配置项目，影响的是哪一个个过程？
   * 改动 host 文件是如何实现fq的？
   
* http 优缺点 及其 优化
   * http 与 grpc/云函数/webservice 之间的关系
   * 优缺点列举，如何改进？
   * 无状态、长连接、websocket几种概念之间的差别，各自的优势是什么？
   * 长链接、与性能、http队头阻塞、tcp队头阻塞的区别在哪
   
* http 基础
   * 报文格式、各个字段大小
   
* 报文字段
   * 数据类型、压缩格式、语言类型、编码方式、Vary字段
   * 范围请求
     * Range、视频的请求、多端下载、断点续传
     * 一次请求多个，使用multipart/byteranges的关系
     * http的分块传输与tcp层的分块传输有什么关系呢？
     * 遇到范围请求中有压缩的情况，那么range与内容大小的关系型是怎么样的呢？
   
  * 浏览器缓存
    * http缓存
    * cookie 
       * secure 字段、same-site、XSRF、XSS
           * 基础知识补充
           * 攻击举例与防护
           * 使用淘宝、京东、支付宝网站的访问数据包进行解析
       * domain 与 path 的使用，结合工作经验谈一下 
       * 第三方cookie是什么？百度、google广告的基本实现逻辑[参考文章](http://www.bobulous.org.uk/misc/third-party-cookies.html)
       * session 回话的概念又怎么算呢？如何与cookie配合
    * 强制缓存 max-age、no-cache、no-store、must-revalidate 三个缓存控制的含义
    * 协商缓存 If-modify-since - Last-Modify、If-None-Match - Etag、
    * 缓存代理
       * 服务端缓存体系
       * 客户端缓存体系

 * http 代理
   * 负载均衡、安全防护、洗数据等
   * Via 字段的解读
   * X-Forwarded-For X-Real-IP
   * HAProxy 所定义的代理协议是什么？

* http 状态码
  * expect-code 是什么作用？
  * 204 与 head 请求有什么关系？
  * 206 状态码单独理解
  * 301与302，303、304、307两组状态码细化复习理解
     * 301 与 302 的使用场景，ajax请求中返回301/302，前端是如何处理的呢？
     * 内部重定向与外部重定向的区别？
  * 4xx、5xx类的错误码都详细标明了客户端错误、和服务端错误，为何在实际开发中，我们常常使用200 ok，然后在message 中携带服务端自定义原因字符串的方法来代替这种http标准形式呢？

* http 请求方法
  * option 的使用场景
     * option 是否受控制呢？
     * 和跨域又什么关系？(跨域的判断，是否为简单请求？)
  * 如何判断请求方法是否为幂等？如何防止非幂等的操作呢？实际项目中有哪些提现？
  
* http url+uri
   * scheme 的各种形式与实际用途
   * path 的实际组成部分，是否包含前后的 '/'，为什么是 '/'不是'\'
   * 简单结合 nginx 配置的location proxy-pass 两个常用配置来说明url的解析
   * url 中的冲突字符参数如何处理？实际应用场景呢？
   
   
 * restful 编程
   * 简述归纳一下restful的使用规则
   * 几年下来的工作经验，实际使用情况与场景

* 网址输入后发生了什么 - 文章补充   
  * DNS 缓存部分的内容
  * 补充 redis、vanish等框架级别的缓存过程
   
  
 * https
   * 加密原理
     * 浏览器的同源策略，在https的体系统，是否起到一定的辅助作用？
     * TLS(1.0) 实际就是 SSL(v3.1),最新的安全版本是多少，对应使用的是什么加密套件、加密算法？
     * OpenSSL 规范，以及其在工作中的应用。
     * 对称加密、非对称加密的基本原理，常用算法有哪些？哪些已经被证明安全？
     * 对称加密在实战中有什么实用场景呢？结合你的行业特点来说明一下。
   * https握手过程
     * pre-master 与 证书分别起到什么角色，整个过程中对称与非对称加密，都出现了几次？
    

* CDN 深入理解
   * CDN 是处于七层网络中的哪一层？
   
 
