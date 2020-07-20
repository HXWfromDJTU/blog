# DNS工作原理

## 简介
`DNS` （Domain Name System 的缩写）的作用非常简单，就是根据域名查出IP地址。你可以把它想象成一本巨大的电话本，电话黄页。 使用的是`UDP`协议进行传输。


### dig 
![](/blog_assets/dns_dig_query.png) 



### host
![](/blog_assets/DNS_7.png) 


### nslookup命令
![](/blog_assets/DNS_9.png) 

##### `whois`命令
![](/blog_assets/DNS_8.png) 




## DNS 查询步骤 

### 查找DNS服务器
每一次连接网络的时候，`DNS`服务器都是可以通过`DHCP`协议动态获取的，常用的DNS服务器一般是你接入的`ISP`提供的服DNS服务器。

UNIX系统中，在`/etc/resolve.conf`文件中查看`DNS`服务器的IP地址

```bat
$ cat cat /etc/resolv.conf
```

![](/blog_assets/DNS_2.png)

### 域名分级查找 
域名分级 ： `主机名` `次级域名` `顶级域名` `根域名`   
☎️ 根域名所有的都一样，都为`.root`  
☎️ 顶级域名，一般为常见的`.com` `.net` `.cn` `.edu`  
☎️ 次级域名就是我们常见的 公司名称 ，例如`.taobao` `.baidu` `.alibaba`   
☎️ 主机名一般为子域名称，例如  
 百度地图中 `https://map.baidu.com`中的`map`    
 百度图片中 `https://image.baidu.com`中的`image`  

查找过程先后： 先查找根域名服务器，再是顶级域名服务器，再是次级域名服务器。

其中，最开始的根域名服务器ip地址，全世界限定了十多台根域名服务器，不需要去获取他们的IP地址，一般都直接内置DNS服务器中。   

![](/blog_assets/DNS_6.png) 


## DNS与前端优化 
`DNS`的查询时间也包括在我们访问网站的响应时间内，一般为20-120毫秒的时间，所以减少DNS查询时间，是能够有效减少响应时间的方法。 [MDN原文](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control) 👉

> The X-DNS-Prefetch-Control HTTP response header controls DNS prefetching, a feature by which browsers proactively perform domain name resolution on both links that the user may choose to follow as well as URLs for items referenced by the document, including images, CSS, JavaScript, and so forth.

> This prefetching is performed in the background, so that the DNS is likely to have been resolved by the time the referenced items are needed. This reduces latency(延迟) when the user clicks a link.


### 兼容性
![](/blog_assets/DNS_10.png) 
感动得流泪...IE6-8竟然都支持...  

### 使用
我们来看看`淘宝网`是怎么用`prefetch`的  

![](/blog_assets/DNS_11.png)

```html
<link rel="dns-prefetch" href="http://www.next-resource.com/">
```
### 观察 DNS-prefetch 的工具
使用Chrome浏览器，打开`chrome://histograms/DNS.PrefetchQueue`这个页面，就能查看到

### 项目中使用 dns-prefetch
[Manual Prefetch](https://www.chromium.org/developers/design-documents/dns-prefetching#TOC-Manual-Prefetch) 这是使用`dns-prefetch`之前必须要先知道的知识。文档中提到

![](/blog_assets/manual_fetch.png)

##### 几点使用技巧
* 不需要对`<a>` `<style>`等带有`href`的标签手动`pre-fetch`
* 代码中使用`js`跳转站外的，需要手动进行`pre-fetch`
* 对`script`、`img`、`font`等静态资源进行`pre-fetch`
* 上文提到的含有重定向的背后域名需要进行`pre-fetch`



## DNS负载均衡
本地DNS服务器一般  

GSLB
配置CName   
SLB  
得到多个ip地址，客户端可以坐负载均衡   

___
### 参考文章  
[阮一峰 - DNS入门](http://www.ruanyifeng.com/blog/2016/06/dns.html)   
[前端优化与DNS](https://www.cnblogs.com/rongfengliang/p/5601770.html)  