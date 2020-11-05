
## 前言 
实习时第一次接触`浏览器同源策略`问题，是前后端准备联调需要访问后端Api，呆头呆脑的我再浏览器上发送了好久的 `xhr` 请求，却一直不成功.....头都麻了
![](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/blog_assets/cross-origin-error.png)
一起实习的小伙伴让我在`Chrome`的启动程序上，加上`--disable-web-security`的小尾巴禁用掉同源策略，轻松加愉快地直接解决了问题......
![](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/blog_assets/disable-web-security.png)
 
 作为`web`开发者，工作中不同阶段、不同场景都会遇到`跨域`的情况。这篇`笔记📒`在博客中也随着工作学习的推进，一次次地更新内容，更新自己对`跨域`这一问题的认识。

 以下内容最后更新于`2020.10`，前文内容略有删改。由于这个问题体系比较繁杂，本片文章仅涉及
 * `浏览器同源策略的由来`
 * `为什么要同源策略，不设置会有什么安全问题。`
 * `一些实战中遇到的跨域安全问题`
 * `一些特殊的跨域场景`

 想了解项目中如何进行跨域设置的小伙伴，请关注下一篇文章。

## 浏览器的同源策略
> 同源策略(same-origin policy)是一个重要的安全策略，它用于限制一个origin的文档或者它加载的脚本如何能与另一个源的资源进行交互。它能帮助阻隔恶意文档，减少可能被攻击的媒介。   --- MDN

#### 同源定义
资源`URL`的以下三项中都相同时才认为两个资源是`同源的`
* `协议`: 比如http、https、ws、wss
* `域名`: 包括主域名和子域名，需要做到全匹配。
* `端口号`   

#### 非同源数据存储访问     
* `localStorage`、`IndexedDB` 是浏览器常用的本地化存储方案，两者都是以源进行分割。每一个源下的脚本，都只能够访问同源中的缓存数据，不能实现跨域访问。 
* `Cookie`的匹配规则与上面二者又略有差异，主要差异在于`子域`的`cookie`会默认使用在`父域`上。详细的规则可以参考另一篇笔记 [浏览器原理 - 缓存之cookie](https://github.com/HXWfromDJTU/blog/issues/22)
* `DOM` 如果两个网页不同源，就无法拿到对方的`DOM`。
  比如项目中制作的`Telegram`登录，授权`Button`是一段插入`<Iframe>`的脚本。`Ifream`本身的域名是`auth.telegram.io`。那么域名为`abc.io`的业务页面，则不能`Ifream`中的`DOM`进行访问。
#### 网络资源限制 
* 除了`图片`、`css`、`js`资源外，无法通过网络请求访问不同域的资源
* 能够通过`JSONP`、`CORS`和`Websocket`的形式进行。
* 但 `SOP` 本质上 SOP 并不是禁止跨域请求，而是浏览器在请求后拦截了请求的回应

## 跨域与安全      
### CSRF
##### 同源策略不能直接防范CSRF❌
* 通过恶意连接，`"借用"`用户`cookie`以实现盗用用户登录态的行为，便是大家熟知的`CSRF`攻击。     
* 通过👆上文可知，浏览器的`同源策略`仅仅只是拦截了请求的返回，但并不会阻止跨域请求的发送。     

##### 借助参数防范
* 前后端配合，使用 `CSRF token` 方案进行防范    
  * 检测到不合法后，须入口层面 (比如`nginx`)处拒绝掉请求，否则请求仍然会被服务器处理
* 若非必要不开启`CORS`访问、或者不开启`Access-Control-Allow-Credentials`
* 允许访问的域，使用指定白名单的方式，而不直接使用通配符 `*`。
  * 如果服务器未使用“*”，而是指定了一个域，那么为了向客户端表明服务器的返回会根据`Origin` 请求头而有所不同，必须在Vary响应头中包含 `Origin`。    


关于 `CSRF` 原理与防范实战，请看博主的另一篇笔记，[传送门👉](https://github.com/HXWfromDJTU/blog/issues/29)

## 工作中遇到的跨域问题
#### CDN下的字体文件
* 博主上周给公司`web项目`上了`CDN加速`。开发使用的是`nuxt.js`，在`nuxt.config.js`的配置中很快滴配置好了`static.xxx.io`的`CDN`域名。测试后发现，所有`js``css`、`image`资源都正常，除了项目中的`material-design.woff2`字体文件加载失败了。
  ```css
  /* fallback */
  @font-face {
   font-family: 'Material Icons';
    font-style: normal;
    font-weight: 400;
    src: url(./material.woff2) format('woff2');
  }
  ```
  ![](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/blog_assets/cnd_font_cors.png)

* 问题原因: `字体文件请求`是从我们自己的网站发起的，而请求的是`CDN`资源库上的`字体文件`，明显是you跨域的情况存在。
* 解决办法
  * 博文使用的是 `阿里云`,直接在`CDN`服务后台添加上跨域白名单即可。[参考这里](https://www.vicw.com/groups/cats_and_dogs/topics/223)
  * 若是自己的`CDN`服务，那就自行在对应机器上的`nginx`或者服务上加上返回头 `Access-Control-Allow-Origin: 'your.domain.com'`    

#### Script Error 与 crossorigin
问题出现的过程:
1. test.com 下的页面引用了属于 http://other-cdn-domain.com 的 `target.js` 文件  
2. 在 test.js 运行过程中发生了错误，因为第三方隐私安全的原因，浏览器不会把错误信息报出来。 

如何解决: 
1. 给`script`标签增加 `crossorigin` 属性，让浏览器允许页面请求资源。
    ```html
    <script src="http://other-cdn-domain.com/static/target.js" crossorigin>
    ```

2. 参考 CORS 规范，在资源服务端返回跨域头 `Access-Control-Allow-Origin: test.com`
    * 自家的服务器请自己手动添加
    * 若是启用了 CDN 服务，一般服务商的资源配置页面，支持设定返回的请求头

3. 最后就可以可以在控制台中看到 跨域脚本 下的 js 执行异常了。

#### `Allow-Origin: *` 与 `withCredentials = true`
想要跨域请求携带`cookie`，但服务端允许跨域的端口却是`*`的话，听起来就是矛盾的。
![](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/blog_assets/with-credentials-error.png)

所以服务端需要同时设置二者: 
```bat
add_header "Access-Control-Allow-Origin" "http://fedren.com";
add_header "Access-Control-Allow-Credentials" "true";
```

#### 不一定是跨域
在日常开发调试中，博主在搭配使用`whistle`作为代理服务器进行调试时，应用运行在`Chrome` 的某些版本下。后端接口返回 `5xx` 的异常，`Chrome Dev Tool` 中会显示与接口跨域调用失败一样的错误。   

(截图待补充......)

不知道 `whistle` 是啥?[去看看👉](https://juejin.im/post/6861882596927504392)     

## 参考资料
[1] [浏览器的同源策略 - MDN](https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy)     
[2] [阿里云 CDN 字体fonts跨域问题](https://www.vicw.com/groups/cats_and_dogs/topics/223)    
[3] [CORS - MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS)