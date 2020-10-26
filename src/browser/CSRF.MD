
## 前言
无论是`BS时代`还是`CS时代`，计算机诞生之初安全问题就一直是重中之重。安全也从来都是们大课题，是你出招我接招的武功比拼。本文仅结合当前见识过的一些招数，管中窥豹地去记录一些日常。

#### 安全是体系
> 每一次成功的攻击，看似都是多个低概率事件结果。但墨菲定律告诉我们，会发生的事迟早会发生。

面向安全问题，自己问问自己:
* 后端程序运行的环境一般是`linux`环境，那前端代码的宿主`浏览器`和`node`本身你又了解多少呢？
* 知道什么样的行为容易成为`XSS`的温床吗？
* 知道浏览器`cookie`可以根据`domain`字段判断是否携带。那`Same Site`、`secure`和`第三方cookie`又了解多少呢？
* 除了我们平时熟知的，`XSS`、`CSRF`之外，`网络劫持`、`非法调用`又该如何防范呢？

安全是一个体系，在恶意攻击面前，每一端每一环都是至关重要。程序从前端到后端，需要把安防这套组合拳打好配合，每个环节都至关重要。 

## CSRF
CSRF `(Cross-Site-Request-Forgery)`，中文称之为`跨站点伪造攻击`。主要流程如下

1. `受害者`在`正常网站`登录，并保存登录态到`cookie`中。
2. `攻击者`诱导`受害者`进入事先准备好的第三方网站。
3. 在`攻击者`准备好的第三方网站的恶意脚本中，会向`被攻击网站`发送跨站请求。
4. 并且利用受害者原本就在`被攻击网站`中留下的`cookie`注册凭证，通过`受攻击网站`的后端用户检验。
5. 冒充用户进行各种操作以到达攻击目的(`转移资产`、`查询敏感信息`等)。

#### 原理与特点
* 不需要盗取和修改你的账户,而是利用你的身份。被攻击后，用户难以发现，网站开发者也难以发现。
* 没有防备的情况下，十分容易中招。因为`受害者`可能就不小心点击了一个`恶意连接`，打开的页面一闪而过，攻击可能就完成了。

### 各色各样的CSRF
* `Get请求`CSRF攻击，通常会埋藏在恶意网站中的一个图片链接中，或者给出一个超链接引诱用户点击。
    1. 是因为图片请求可已默认发起
    2. 是因为`img`请求可以绕过浏览器同源策略限制
    ```html
    <!--  自动发起请求 -->
    <img src="https://safebank.com/assets/change-verify-phone?new_number=1345678901">
    <!--  引诱用户点击 -->
    <a href="https://safebank.com/assets/change-verify-phone?new_number=1345678901"></a>
    ```
    上面👆的请求可以要求银行`更换用户绑定的安全手机号`。没错，利用的是你当前浏览器中`cookie`中的身份`token`做的身份验证。
* `POST`类型的CSRF
   ```html
    <form action="https://safebank.com/assets/change-verify-phone">
      <input type="hidden" name="new_phone" value="1345678901">
      <input type="hidden" name="other_param" value="xxxxx">
    </form>
    <script>
      document.forms[0].submit() // auto submit
    </script>
   ```
   通过以上示例，我们得知:   
   1. 通过`表单自提交`请求仍然能够轻松模拟`POST`请求，并且不阻碍浏览器`携带用户token`。
   2. 了解`http`协议的同学，也知道`GET`与`POST`在请求上其实是相同的，只是两端的读取方式上不一致罢了。
* `CORS`类型的CSRF     
   大家会也许好奇，为什么要把个类型拎出来？`CORS`不也是归类到`POST`或者`GET`吗？
   * 在后端设置允许跨域请求`Response Header`中的 `Access-Controll-Allow-Origin`的时候，为什么不建议设置为`*`的原因。
   * 设置为`*`意味着来自所有域的脚本，都可以对这个借口进行跨域访问，多增加了一层风险。   
   
## 防范措施   
![](/blog_assets/filter_bad_man.png)
知己知彼，从上面的总结可以看出`CSRF`的特点
* 攻击的发起大多数都发起自`第三方网站`，除非你的网站已经被`XSS`攻击了。   
* 攻击者并无法读取你的`cookie`信息，只是借用你的`cookie`而已

针对`CSRF`特点，我们针对性可以做出防范:   
1. 直接阻止外域访问   
    * 判断请求来源。
    * 防止外域借用`cookie`中的`token`。

2. 添加外域获取不到的信息到请求中    
    * 知名的 `CSRF-Token` 方案。

### 判断请求来源   
都知道`http`请求是无状态、无连接的，每一次请求的信息都携带在了请求与相应头中，大家是否还记得`Origin`和`Referer`这两个`Request Header`呢？
 
#### Origin 与 Referer
> The Origin request header indicates where a fetch originates from. It doesn't include any path information, but only the server name. It is sent with CORS requests, as well as with POST requests. It is similar to the Referer header, but, unlike this header, it doesn't disclose the whole path.

> The Referer request header contains the address of the page making the request. When following a link, this would be the url of the page containing the link. When making AJAX requests to another domain, this would be your page's url. The Referer header allows servers to identify where people are visiting them from and may use that data for analytics, logging, or optimized caching  

以上分别是是`MDN`对`Origin` 和 `Referer` 的描述，都可以标明当前请求的来源，而`Referer`更详细。但我们更需要关心的是这二者发送与不发送的情况。

* Origin
    1. 仅在发生跨站点请求、或者同域的`POST`请求下携带      
    2. IE 11 中`CORS`请求也不会写带`Origin`请求头    
    3. 在`302`重定向之后的请求中，不包含`Origin`请求头     
* Referer
    1. 协议为表示本地文件的 "file" 或者 "data" URI 时不发送。    
    2. 当前请求页面采用的是非安全协议，而来源页面采用的是安全协议(HTTPS)。     
    3. 在`IE 6`和`IE 7`下，使用`location.href`或者`window.open`进行跳转都不携带`referer`      
    
#### 防范措施     
`Origin` 或者 `Referer` 属于自己的白名单中，则直接拒绝访问。简单粗暴地处理，会有以下问题:
* 从以上可以知道`Origin`和`Referer`请求头是不完全可靠,只能够借助这两个请求头进行`初步防御`。   
* 用户通过`搜索引擎`跳转访问页面的时候，`referer`一定会是`搜索引擎`的域名。会拒绝掉正常流量。
  ![](/blog_assets/referer_google_youtube.png) 
* 若你的网站显示被`XSS`攻击后，那么`攻击方`就会很粗暴地成为你自己的`Origin`了。    


### 使用 CSRF Token
要说读取`Origin/Referer Header`信息像是检查你的`车票`，那么`CSRF Token`则像是则是检查你的`身份证`了。区别就在于你能够拿出一些，别人拿不出来的东西，以证明该请求的合法性。    

#### 实现步骤
1. 下发 CSRF Token 给页面     
    * 用户首次打开页面的时候，服务器需要给用户生成一个`CSRF Token`(一般为随机字符串和时间戳的哈希)，服务器存储一份，下发给客户端一份。
    * 为防止 `CSRF` 攻击者利用，不再使用`Cookie`存储和提交`CSRF Token`
2. 前端开发者使用其他位置存储，并在后续的每一个`请求参数`中携带这个`CSRF Token`
    * 一般可以在`beforeSend`的`intercepter`中统一添加
3. 服务器根据`Token`的合法性，决定是否要处理此请求
    * 包括验证随机字符串合法性
    * 和验证`时间戳`是否超过有效期

#### 存在的难度
1. 下发的`Token`是页面级别的，在大型网站中`session`存储大量的`CSRF Token`压力是巨大的。
2. 在多台服务器分布式机器的环境下，需要使用`Redis`作为多台服务器的公共存储空间
3. 后端需要以`页面`为维度去处理`Token`，工作量巨大。
4. 前端来看，有些不能使用统一拦截器的请求。比如`<a>`标签跳转、`<form>`提交，则需要手动添加`CSRF Token`

### 验证码 与 支付密码
回想我们使用`金融类`的App时候，就算你已经登录了，在支付的时候也需要再次输入`支付密码`呢？这里面的`支付密码`和`验证码`，其实就相当于`支付`这个请求的`CSRF Token`。这个方法适用于`少数关键`的几个接口。     

```js
{
  email_verify_code: "1213"
  password: "250f78769f22a8c43a2b767fde4b093fbbcdc28bd7ecac4bad883a4b0fcf30e3"
  timestamp: 1603684913776
  value: "2"
}
```

### 简化版（反向） CSRF Token
在业务处理中去验证token的有效性极大地添加了开发工作量。那么有没有更轻便的形式完成简单的`CSRF Token`工作呢？尝试一下流程:
1. 前端项目配置文件中，动态地生成一个`signKey`，作为后续加密使用。
  ```ts
  // app.config.ts
  const CSRFTokenInfo = {
    appName: 'bank',
    signKey: 'ajhsbdkjasu123123bjsbkd'
  }
  ```
2. 前端开发者，在请求服务器接口时，使用`signKey`和`请求参数`，生成请求的`signature`:
    * 获取该请接口的`path`、当前时间`timestamp`、本应用的id`appName`作为、签名参数`signKey`作为准备参数
    * 将以上四者，按照一定规则拼接在一起。(规则不固定，但要服务器便于还原读取)  
    * 使用`md5`进行加密生成`signature`
    ```ts
    // request.interceptor.ts
    export function signRequest (config: RequestConfig) {
        const key = CSRFTokenInfo.signKey
        const timestamp = Date.now()
        const fullPath = [(config.baseURL || '').replace(/\/$/, ''), (config.url || '').replace(/^\//, '')].join('/')
        const path = new URL(fullPath).pathname

        // 明文签名
        const text = `app=${CSRFTokenInfo.appName}&timestamp=${timestamp}&path=${path}&signature=${key}`
        // 加密签名
        const signMessage = md5(text)

        // 绑定到请求头中
        config.headers['x-service-app'] = CSRFTokenInfo.appName
        config.headers['x-service-timestamp'] = timestamp
        config.headers['x-service-signature'] = signMessage

        return config
      }
      ```
3. 将生成签名过程的`input`(app、timestamp)与`output`(signature)通过请求头传递到后端
    ```js
    // other request header...
    x-service-app: bank
    x-service-signature: 12dsf222ssdf312d334sddzxczxcz
    x-service-timestamp: 1403691292039
    ```
4. 服务器准备:
    * 为了减少业务方的开发，签名校验服务推荐在`nginx` + 本地脚本校验的形式完成
    * 获取到`前端`请求中携带的`app`、`timestamp` 与 `signature`参数，结合`nginx`中拦截到的请求`path`，和前端一样重新计算一次`signature`，并且比对结果
    * `timestamp`字段则另外再加一个防重放时间的检测
    * 通过校验则放行请求到业务处理方层，否则直接拒绝
5. 那么`signKey`两端该如何同步呢？
    * 与服务端下发`CSRF Token`不同，这次我们反向去考虑问题
    * 项目开发时通过本地脚本，将`app.config.ts`中配置的`signKey`加入到发布脚本中
    * 项目发布时，`ci`机器一般拥有`ssh`到正式环境的权限。
    * 通过发布脚本在`ci`发布流程完成后。执行特定的`script`以启动服务器上更新`signKey`为前端本地的值。
      ```bat
      # build 项目 .....
      # reload 项目 ....
      # 更新signKey
      python xxx/xxx/update-sign-key.py -- bank ajhsbdkjasu123123bjsbkd
      ```
#### 优缺点
  * 可以看出`signKey`的更新是由前端驱动的，只有在发版的时候才会更新，实时性并不如第一种方案。
  * 统一在`nginx`层处理，可以大量减少后端同学的开发工作量。

### SameSite Cookie
所谓成也`Cookie`,败也`Cookie`。`CSRF`则是利用浏览器的这个规则漏洞建立起来的攻击方式。前面说到，安全每一个环节都有责任，那么作为前端主要运行环境的浏览器，是否也可以在`Cookie`规则上进行优化呢？

![](/blog_assets/same-site-cookie-compatibility.png)

这里推荐一个小工具给大家测试自己浏览器的`Same-Site Cookie`支持情况，[传送门](https://samesite-sandbox.glitch.me/)
## 发现CSRF
根据上面的总结，`CSRF`攻击，通常有以下的特点
* 第三方发起: 说明我们要关注非白名单中的域，发起的跨域请求
* 使用`img`作为`CSRF`请求时，`Request Header`中的`MIME Type`为图片，而想要窃取的数据返回的`MIME Tpye`一般为`plain/text`、`json`等文本信息
* 后端童鞋在review 日志的时候，需要多关注以上类型的请求     


### 参考文章
[1] [HTTP headers 之 host, referer, origin ](https://juejin.im/post/6844903954455724045)    
[2] [浏览器的沙箱模式](https://www.cnblogs.com/slly/p/6639173.html)  
[3] [前端优化 - by Alex 百度](https://juejin.im/book/5a8f9ddcf265da4e9f6fb959/section/5a8f9f7bf265da4e82635e46)   
[4] [前端安全系列（二）：如何防止CSRF攻击？ - 美团技术团队](https://tech.meituan.com/2018/10/11/fe-security-csrf.html)     
[5] [CSRF 漏洞的末日？关于 Cookie SameSite 那些你不得不知道的事](https://zhuanlan.zhihu.com/p/137408482)
