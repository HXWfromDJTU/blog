## 前言
基于上一篇`cookie`的基本使用场景和用法，这回来记录下项目关于`cookie`中遇到的问题和解决方案。 

`cookie`解决的基本问题是`http`的无状态性，项目中大多数的场景也利用这个特性用于标记用户。    
* 登录后下发`auth token`标明用户的登录态。      
* 广告商下发`ssid token`，并通过整个`广告联盟`中的网站中上报的`ssid token`，收集用户的访问行为。    

## Cookie 与 Session
简单滴说，session 是什么呢？
* `Session`是一个临时的进程组群，目的是去完成一些任务，是直接存储在`内存`中的。    
* 每当`OS`接收到新任务的时候，就会调度进程去执行任务。
* 一个进程忙不过来就会继续调用其他进程或者创建子进程一起去执行，出现的这些进程会被分为一个个的进程组，最后这些共同完成任务的进程组一起可以被理解为一个`Session`会话。
* `Session` 一般有效期设置为`20min`，若超时时间内没有数据交互，服务器就会将`Session`对应的资源删除。       

### 传统 Session/Cookie 工作过程
1. 当客户端首次向服务端请求的时候，服务端维护一个`Session`，生成一个`sessionid`，值可以随意约定，就是一个用于标记session的值。

2. server 通过 http 响应客户端，客户端接收到了并保存在`Cookie`中。

3. 客户端结束掉了请求连接，服务端就会释放掉这些进程对资源的占用，本次会话的`状态`会被暂时保存在一个文件中，在一定的时间内，服务端会保留这个文件。

4. 在超时时间范围内，客户端每次访问该域名都会用`cookie`携带`sessionid`到服务端。服务端再根据`sessionid`找对应的`Session`，并且根据这个状态中记录的内容，打开对应的资源。      

<!-- 对于客户端来看，客户端后来每次去访问的时候都可以直接跳过了身份验证等重复操作，造成了好像服务器是一直在等待客户端的假象，其实服务器在连接断开的时候就释放掉了对应的进程资源。 -->

#### 存在的问题
* 客户端有可能禁用`cookie`
* 服务端使用内存存储用户信息，当用户数量增大的时候，内存肯定不够用
* 当服务端采用分布式部署的时候，用户的登录态 `Session` 并不能够被共享     
* 口令仍然保存在客户端，有可能被仿造 和 存在被盗用的风险     

我们来逐个解决下这些问题。


##### 使用 url query 代替 cookie 传参
* 在用户禁用`cookie`的情况下，用户访问服务器页面时，服务器可以下发token到前端，前端使用`cookie`以外的 web storage 技术进行 token 存储。    
* 前端请求后端接口时，从本地存储中取出 token 携带在请求参数中
    * GET 请求拼接在 url query 中
    * POST 请求可以放在 body 中

##### Session 与 高速缓存
* 当内存存储出现性能问题、并且会遇到分布式`Session`不能共享的问题时，高速缓存工具就是首选，比较热门的有 `Redis` `Memcached` 等    
* 缓存服务 与 引用服务将会保持长链接，而并非是频繁的短连接     
* 缓存服务 与 应用服务一般部署在同一个机房，访问速度受到网络影响一般比较小    

##### token 的结构与加密
* 添加客户端独有的信息作为加密的盐，比如用户访问时的`IP`或者`浏览器型号`等等。     
* `明文信息` = `随机生成字符串` + `客户端独有信息`后，通过服务端独有的私钥进行加密，最终生成下发的`token`   
* JWT 结构一般分为三个部分，使用`.`号分割
    * `Header`.`Payload`.`Signature`
    * Header 结构一般为
        ```json
          {
            "alg": "HS256",
            "typ": "JWT"
          }
        ```
     * Payload 部分则为需要保密的主要内容
        ```json
        {
            "user_id":"8192qhgb6kmoh3bypbc9wp146jusho",
            "session_id":"81928yaqk1sccfgwze4k718338z3ae",
            "platform":"wechat",
            "roles":"",
            "props": {"botId":"850444981"},
            "exp":1606291794,
            "iat":1603699794
        }
        ```
     * Signature 部分则是使用秘钥对前面二者的签名结果，`私钥`保存在服务器，以下是生成秘钥的示例。       
        `HMACSHA256(base64UrlEncode(header) + "." +base64UrlEncode(payload),secret)`
    
## 第三方cookie 与 隐私   
[《浏览器原理 - 缓存之cookie》](https://github.com/HXWfromDJTU/blog/issues/22) 这篇文章中聊到`SameSite`时提到了，欧美国家因为隐私安全问题，对`Google`涉及使用第三方`Cookie`来追踪用户行为的操作，进行了巨额的罚金。    

1. 各大浏览器厂商也陆续跟进了`SameSite`属性的实现，将`Lax`规则设置为默认规则。    
2. 使得网站以前下发的`token`，在跨站条件下直接无法发送。     
![](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/blog_assets/same-site_telegram.png)    

#### 什么是第三方cookie
某个 cookie 对应的 domain 值，和当前页面服务器所在的 doamin 不属于一个站点。那么对于这个站点来说，这个 cookie 就是一个`第三方cookie`。   
![](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/blog_assets/taobao_third_party_cookie.png)     

若上图，在淘宝主页面下，就存在`hps.tanx.com`和`g.alicdn.com`两个`第三方cookie`。分别是阿里旗下的`阿里妈妈营销平台`和`阿里CDN`。      

#### 如何限制第三方coookie    
1. 在旧版(Chrome 80之前)的Chrome浏览器中，默认只在`无痕窗口`中禁用第三方cookie。    
![](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/blog_assets/third_party_setting.png)

2. 通过设置SameSite字段
   2020年秋天，SameSite 默认值改为`Lax`已经在逐步推广，这意味着除了`超链接` `pre-fetch` 之外，所有的跨站请求都不再携带cookie。   
    ![](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/blog_assets/same-site_support.png)     

### SameSite 有多大影响
说了这么多，像是欧美人和几家浏览器巨头在做商业利益和人权之间的权衡，远远影响不到我们。可事实真是这样吗？    

* 广告营销
    从上面`阿里妈妈`数据平台的第三方 cookie 看出，用户行为收集，数据分析，广告精准投放已经成为大多数平台类的主要收入。而他们标记用户的主要手段就是，在目标网站插入用户信息的脚本。
* 前端打点上报
    与上述问题相同，使用过`Google Analysis`的童鞋应该知道，原理其实和广告追踪一样。更像是一种`正义`的数据收集 [滑稽脸.png]
    ![](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/blog_assets/google_analysis_cookie.png)   
* 第三方登录受影响
    许多使用`iframe`嵌入第三方域的`授权登录`都将因为之前没有设置`SameSite`这个字段，而被浏览器升级导致默认为`Lax`，进而导致之前的`Cookie`而失效。   (抱歉，👇这个图我又用了一次)
    ![](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/blog_assets/same-site_telegram.png)   

    作为下发授权的网站，需要默认更新你的设置cookie策略，声明式地将`SameSite`设置为`None`。

* 非同站的跨域请求
    1. 日常开发中，假如我们的项目名为`queen`，那么前端通常页面部署在`my.queen.io`，api的域名通常为`api.queen.io`和`login.queen.io`,这种情况不受到`SameSite`的影响。   
    2. 项目多了，需要调用第三方`api`,调用兄弟部门的`api`, 则日常的`CORS`请求中携带对方域名的`cookie`就会出现问题，不仅仅是`withCredentials = true`可以解决问题的。   
    3. 解决办法参考上一条，需要第三方下发 cookie 时带上`SameSite=None`

#### None 必须是 Secure
第三方选择显式关闭 `SameSite` 属性，将其设为 `None`时，前提是必须同时设置 `Secure` 属性, 标明 Cookie 只能通过 HTTPS 协议发送，否则无效。

<!-- ## websocket 与 cookie      -->


## 参考文章
[1] [JSON Web Token 入门教程](https://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html)     
[2] [当浏览器全面禁用三方 Cookie - 知乎 by conard](https://zhuanlan.zhihu.com/p/131256002)   
[3] [Cookie 的 SameSite 属性](https://www.ruanyifeng.com/blog/2019/09/cookie-samesite.html)    
[4] [SameSite cookies - MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Set-Cookie/SameSite)
