## 前言
过去两年的时间有幸可以去主导多个 `toC` 的 web 项目，随着用户量的不断增大，也就让“朗读并背诵全文”的全前端优化手段们得到了实践的机会。

项目的基本信息: 
* 项目基础框架使用的是 `nuxt.js`
* 数据上报使用的是 `Google Analysis`
* 错误监控使用的是开源的 `Sentry`
* 前端项目和后端api都是部署在阿里云上

接下来说说自己在过去一年多里，优化项目是如何在项目中落地。     

## 优化起步
随着项目功能模块地增多、用户量也在不断地积累，运营同学那边收到用户的反(to)馈(cao)越来越多... 
* *xxx is great, but the xxx on web sometime drive me crazy... 😡        

* 一个帮我们推广应用的大V 在推广视频中，面对首页的 8s 加载时间，竟然习以为常地吹起了口哨，平静地向粉丝说 `“Dont worry, It just usually take a while.”`        

天天忙着改 bug 的我们组还没来得及看运营小姐姐的的消息，就被老板在群里 `艾特`了。      

> ![](/blog_assets/cctip_io_ga_main_speed.png)
  ![](/blog_assets/cctip_io_ga_load_time_before.png)  
  @前端组-ALL 这样的体验，凭我们凭什么留住用户？？？ 

两张图重重地砸在了我的脸上，将近 `10s` 的平均加载时间，和主要用户来源马来西亚的加载时间甚至达到了 `11.41s`。      

随手打开线上的项目主页，就碰到了和 `大V` 哥一样的尴尬.....，`nuxt 的loading` 足足占据了屏幕 `15s` 才缓缓出现内容。      

<img src="/blog_assets/cctip_io_index_loading.png" width="300px">     

要我自己是用户早就关掉了......

## 定位问题      
### “平均网页加载时间”   
冤有头债有主，解铃也还需寄铃人嘛。既然是 “平均网页加载时间” 惹了众怒，那就查查 `Google Analysis` 对这个词儿是如何定义的吧。 [传送门👉](https://support.google.com/analytics/answer/2383341?hl=zh-Hans)

![](/blog_assets/google_analysis_dcl.png)     

`Google` 的描述和我们web开发中的 `load` 事件基本一致。

> 当整个页面及所有依赖资源如样式表和图片都已完成加载时，将触发load事件。   --- MDN

### 问题根源
通过具体分析得知，有以下几个点影响了我们的 `load` 时间...  

1. 未登录状态下，加载了一个第三方的脚本，用于加载一个授权登录的`iframe`页面，但由于各个国家墙的原因，这个脚本静态会加载失败
2. 已登录状态下，用户的资产页面会有大量的代币资产logo图片需要加载
3. webpack打包后，页面的主要 `Javascript` 文件大小太大，网络加载速度也很慢，直接导致了用户看到大大的loading图标过久。     

### 优化办法
#### 结果未知的外链脚本

## 目录
* Google Analysis
    * 老板看到的
    * 如何决策你的优化方向
        * 国家/地区
        * 设备/平台
* 如何说服你的 boss，允许你投入时间去做优化呢？     
    * 同样是使用 GoogleAnalysis
* 如何展示你的成果呢？     
* SSR 去做的 SEO 和 社交平台连接解析信息  
* Nuxt.js 页面缓存    
    * 静态资源 CDN，使用第三方 CDN 服务后，一般都会自动加上了缓存
    * 注意流量费用     
* nuxt.js assets preload [assets-preload](https://zh.nuxtjs.org/docs/2.x/configuration-glossary/configuration-render/#resourcehints)     
    * 首先需要在 Chrome Devtool 中找出你需要preload的资源
    * 也就是阻塞你的FCP 的那些行为
* fre-fetch 是用户后续需要点击的。     
    * doc.cctip.io 是另外一个域名
    * cctip.io 也是另外一个解析
    * 因为我们会预解析的内容并不多，所以对用户的消耗并不大  
    * DNS-prefetch   
* Lazy Load
   * 代币资产页面，超级多的代币图片，挂载会卡顿

* localstorage 缓存
    * 触发点是用户报告流量使用过大
    * 使用本地缓存减少loading
    * 权衡之后的技巧
        * 不要去频繁更新全量列表，可以有针对性地去获取页面需要的部分数据
* 使用 http 2.0
    * 所有项目都直接使用了 http 2.0
    * 给出 nginx 的配置   

* 移除无用的包，简化包
    * lodash

![](/blog_assets/google_analysis_speed.png)

## 讲座
* 带宽
* DNS 解析
    * 网页资源中存在着不同的 host，都需要 DNS 解析
* TCP/TLS   
    * 跨域请求减少预请求， max-age
    * websocket 的改造, 用户体验提升。
        * 消息推送
        * 实时数据
* 检测的工具
    * light house
    * pageSpeed insight
    * chrome user Experience Report
* overview
    * 延迟 RTT
        * CDN
        * 
        * localstorage 本地缓存
    * 带宽
    * 静态文件大小
    * TCP 握手时间
    * DNS 解析时间



## 参考资料
1. [Caching Components - Nuxt.js](https://zh.nuxtjs.org/faq/cached-components/)    
2. [Nuxt中如何做页面html缓存 - juejin.im](https://juejin.im/post/6857809671646871566)    