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




## 域名分级查找 
| 域名分级 | 解析服务器| 解析器地址存储位置 | 举例 |
| --| -- | -- | -- |
| 根域名 | 根域名服务器 | 本地DNS服务器 | `.root` |
| 顶级域名 | 顶级域名服务器  | 根域名服务器中 | `.com` `.net` `.cn` `.edu`|
| 权威域名 |  各家公司自己的服务器 | 顶级域名服务器中 | `.taobao` `.baidu` `.alibaba`|
| 子域名 | 各公司的web服务 |  | `map.baidu` `image.baidu` |

```
先查找根域名服务器 ===>  再是顶级域名服务器  ====>      再是权威域名服务器      ====>        自身服务器子域名服务
(.root)              (.com /.cn /.net)       (.baidu.com /abc.cn/hupu.net)       (music.baidu.com/map.baidu.com)
```
### 1、查找本地缓存
每一次`DNS`的查找结果，OS都会进行一定时间的缓存。

### 2、向本地DNS服务器查找
每一次连接网络的时候，`DNS`服务器都是可以通过`DHCP`协议动态获取的，常用的`DNS`服务器一般是你接入的`ISP`提供的服`DNS`服务器。

#### 本地 DNS 服务器地址从哪里来
`UNIX`系统中，在`/etc/resolve.conf`文件中查看`DNS`服务器的IP地址。Mac 使用`偏好设置一样可以看到对应设置`。

```bat
$ cat cat /etc/resolv.conf
```
![](/blog_assets/DNS_2.png)

![](/blog_assets/mac_dns_config.png)

#### UDP DNS
客户端(系统)向本地DNS服务器查找`ip`，这个过程`OS`通过`UDP`请求向本地`DNS`服务器询问这个`www.baidu.com`对应的`ip`是多少。

为什么是`UDP`呢? 因为这时候只需要查询一个`www.baidu.com`的`ip`地址，数据量极少，不可能超过`512`字节，所以为了速度。

#### TCP DNS 
首先我们要知道两个概念，`DNS主服务器`和`DNS辅助服务器`

> 主服务器托管控制区域文件，该文件包含域的所有权威信息（这意味着它是重要信息的可信源，例如域的IP地址）   

> 辅助服务器包含区域文件的只读副本，它们通过称为区域传输的通信从主服务器获取其信息。每个区域只能有一个主DNS服务器，但它可以有任意数量的辅助DNS服务器。

> 一台DNS服务器可以是一个区域的主要服务器，也可以是另一个区域的辅助服务器。     

其实这里是要补充说明一下，`DNS`中也有一个地方用到了`TCP`协议，那就是`辅助DNS服务器`从`区主DNS服务器`中，读取该区域的`DNS数据信息`的时候，称之为`区域传送`。这个过程因为数据量比较大、而且需要保证正确性，所以这里使用到了可靠传输`TCP`。


### 3、根域名服务器
> 所有根域名服务器都是以同一份根域文件（Root Zone file，文件名为root.zone）返回顶级域名权威服务器（包括通用顶级域和国家顶级域），文件只有2MB[31]大小。截至2017年10月9日，一共记录了1542个顶级域。对于没被收录的顶级域，是没法通过根域名服务器查出相应的权威服务器。而其他递归DNS服务器则只需要配置Root Hits文件，只包含根域名服务器的地址。

来自维基百科的词条，不多解释

### 4、顶级域名服务器
说到顶级域名的制定的管理，就不得不提`ICANN`这个组织，他是原来美国商务部的一个机构，现在独立为一个非盈利机构，专职管理域名。👆上面根域名服务器返回的`2MB`文件，就是这些`顶级域名`与其对应服务器地址。

当然，这些服务器`ICANN`不会都自己进行管理，而是交给不同的服务商。

### 5、子域名服务
子域名服务一般由开发者自身的服务器中的`web`服务器来充当，比如我们熟悉的`nginx`。

![](/blog_assets/sub_domain.png)
   

### 流程总结
![](/blog_assets/DNS_Resolve_Routing.png)
<div align=center>图2 来源与 《趣谈网络协议》 - 18 讲</div>



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

___
### 参考文章  
[1] [阮一峰 - DNS入门](http://www.ruanyifeng.com/blog/2016/06/dns.html)   
[2] [前端优化与DNS](https://www.cnblogs.com/rongfengliang/p/5601770.html)     
[3] [主DNS服务器与辅助DNS服务器的区别](https://www.dns.com/supports/1224.html)   
[4] [讲讲DNS的原理？](https://zhuanlan.zhihu.com/p/79350395)   


<!-- 

## DNS负载均衡
本地DNS服务器一般  

GSLB
配置CName   
SLB  
得到多个ip地址，客户端可以坐负载均衡    -->
