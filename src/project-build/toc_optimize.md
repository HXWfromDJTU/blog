## 前言
过去两年的时间有幸可以去主导多个 `toC` 的 web 项目，随着用户量的不断增大，也就让“朗读并背诵全文”的全前端优化手段们得到了实践的机会。

项目的基本信息: 
* 项目基础框架使用的是 `nuxt.js`
* 数据上报使用的是 `Google Analytics`
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

`Google Analytics` 的描述和我们web开发中的 `load` 事件基本一致。

> 当整个页面及所有依赖资源如样式表和图片都已完成加载时，将触发load事件。   --- MDN

### 问题根源
通过具体分析得知，有以下几个点影响了我们的 `load` 时间...  

1. 未登录状态下，加载了一个第三方的脚本，用于加载一个授权登录的`iframe`页面，但由于各个国家墙的原因，这个脚本静态会加载失败
2. 已登录状态下，用户的资产页面会有大量的代币资产logo图片需要加载
3. webpack打包后，页面的主要 `Javascript` 文件大小太大，网络加载速度也很慢，直接导致了用户看到大大的loading图标过久。     

### 优化办法
#### 图片延迟加载
你一定也遇到过首屏是列表页，每个列表项上都有一个或者多个图片需要加载，大量的图片同时加载时间十分不确定，同时渲染到 DOM 上也会造成页面的卡顿。

老问题了，方法也多:
* 改接口，分页渲染数据项
* 一次性获取数据，但是前段使用 “卷帘” 等手段进行资源懒加载

#### 结果未知的外链脚本
多数情况下，这部分脚本的加载，不会影响到首屏的主观体验。但当首屏加载完成，用户主动去触发该功能时，需要做好所对应功能 `“加载未完成”` 等提示。     
```js
const targetScript = document.getElementById('targetScript')   

targetScript && targetScript.onload = () => {
   const authIframe = document.getElementById('auth-iframe')

   authIframe && authIframe.onload = () => {
       loaded = true
   }
}
```
在自己合适的地方自定义 `page load` 事件，这样使得 `Google Analytics` 上的数据更直观。      
```js
ga('send', 'timing', 'JS Dependencies', 'load', timeSincePageLoad);
```     
因为实际上我们需要的是 `TTI` (可交互时间)。这部分内容可以参考[这篇笔记 👉](https://github.com/HXWfromDJTU/blog/issues/27)     

#### 关键资源加载速度慢
资源加载速度慢有两个方面，一个是资源本身体积过大，二是网络传输速度太慢。

##### 资源压缩
`webpack`打包优化网上的资料很多，这里就不拓展开讲了。这次只是习惯性地运行一次 `analyser`，便可以发现那个眨眼的 `lodash.js`     

<img src="/blog_assets/lodash_webpack_too_big.png" width="500px">        

```js
// 全部引入
import { toNumber, sortby } from 'lodash-es'

// 改为单独引入
import toNumber from 'lodash.toNumber'
import sortby from 'lodash.sortby'
```

##### CDN加速
上面的一顿操作后，JavaScript 文件的大小的到了控制，但海外用户反映还是慢慢慢慢慢慢慢慢慢慢慢慢.....

这时候针对性地上了一个部分地区的 CDN 服务。域名配置的是 `static-xxx.io`。
![](/blog_assets/cdn_before.png)   
![](/blog_assets/cdn_after.png)   

根据 `Nuxt.js` 的文档([传送门👉](https://zh.nuxtjs.org/docs/2.x/configuration-glossary/configuration-build/#publicpath))配置一下，发布前尝试一下连通性...就可以发到线上试试啦。       
```js
export default {
  build: {
    publicPath: 'https://static-xxx.io/_nuxt/'
  }
}
```

实际效果也比较明显
![](/blog_assets/cdn_assets.png)
![](/blog_assets/cdn_result.png)


## 缓存的使用
随着 Web 应用的不断复杂化，早就已经不是填写一个表单就离开的那个时代了。特别是在移动端使用你的 web 服务时，总是想要体会到和原生 App 一样的感受。此时，本地缓存就变得越来越重要了。     

### 干掉loading
<img src="/blog_assets/loading_page.png" width="200px"> 
<img src="/blog_assets/loading_page.png" width="200px">
<img src="/blog_assets/loading_page.png" width="200px">   

无论是作为用户还是开发者，你是不是也受够这无穷无尽 loading。滥用 loading 作为你页面的遮羞布，长此以往只会让你的页面越来越不可用。     

#### 优化手段
1. 页面加载时首先使用本地缓存展示页面
2. 使用脚本 `ajax` 或者 `websocket` 进行静默地数据更新
3. 若本地没有缓存，才使用 `loading` 进行数据更新，更新后也缓存到本地     

![](/blog_assets/data_load_cache.png)

对于 loading 提醒的其他建议，可以看看[这篇笔记](https://github.com/HXWfromDJTU/blog/issues/30)        

## 减少网络延迟
#### 减少请求握手
针对于数据实时性要求强的业务模块，请求的信道的搭建时间已经远远地超过了数据的实时性本身。这次使用的是 `websocket` 的解决方案。  

![](/blog_assets/websocket_request_response.png)


在减少了请求我收的同时，也带来了一些问题: 
1. 处理流程与现有的 `http` 请求不兼容 
2. 鉴权机制也需要特殊调整     

具体操作请参考[这篇笔记👉](https://github.com/HXWfromDJTU/blog/issues/15) 

#### 减少跨域预请求
数据请求一般要求下都是发送的`非简单请求`，这其中就会包括预请求的时间。使用 `Access-Control-Max-Age: xxx` 减少预请求的次数。     

详细的原理请参看[这篇笔记👉](https://github.com/HXWfromDJTU/blog/issues/35)    

#### 减少 DNS 时延 
`prefetch` 是浏览器的一种机制，可以利用空闲时间提前先帮你下载好 `未来` 可能需要的资源。    

1. `dns-prefetch` 可以帮助我们在用户仅仅访问主页的情况先，优先帮助用户完成 `DNS` 查询，并缓存结果再浏览器中。
    ```html
    <!-- 十分可能访问页面 -->
    <link rel="dns-prefetch" href="https://doc.xxx.io/" >
    <link rel="dns-prefetch" href="https://home.xxx.io/" >
    <!-- 肯定会用到的接口URL -->
    <link rel="dns-prefetch" href="https://api.xxx.io/" >
    <link rel="dns-prefetch" href="https://login.xxx.io/" >
    ```

2. 类似于 `http 2.0`的 server push的意思，前端也可以要求浏览器提前把需要的 `css` 、`font` 等资源提前下载到缓存中。并结合资源的 `max-age` 和 `expire` 缓存策略达到跨页面使用。      
    ```html
    <link rel="prefetch" href="telegram.auth.com/123ahisdhu2.js" />
    ```

MDN 连接: [[dns-prefetch]](https://developer.mozilla.org/en-US/docs/Web/Performance/dns-prefetch)     [[prefetch]](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Link_prefetching_FAQ)

#### 持续补充中....


<!-- ## 目录
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
    * DNS 解析时间 -->



## 参考资料
1. [Caching Components - Nuxt.js](https://zh.nuxtjs.org/faq/cached-components/)    
2. [Nuxt中如何做页面html缓存 - juejin.im](https://juejin.im/post/6857809671646871566)    
3. [Prefetch, Preload - segmentfault](https://segmentfault.com/a/1190000018828048)   
4. [使用 Preload/Prefetch 优化你的应用 - 知乎](https://zhuanlan.zhihu.com/p/48521680)