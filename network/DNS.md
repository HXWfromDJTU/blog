# DNS工作原理
![](/blog_assets/DNS_COVER.png)

### 简介
DNS （Domain Name System 的缩写）的作用非常简单，就是根据域名查出IP地址。你可以把它想象成一本巨大的电话本，电话黄页。 

使用`dig`命令工具能够重现DNS查询的过程...
```bat
# dig 域名
```
![](/blog_assets/DNS_1.PNG)  

使用`short`参数能够省略过程，直接检索出结果...

![](/blog_assets/DNS_4.PNG)  

让我们验证一下查询结果  

![](/blog_assets/DNS_3.PNG)


### 步骤 

##### 1️⃣ 查找DNS服务器
每一次连接网络的时候，DNS服务器都是可以通过DHCP协议动态获取的，常用的DNS服务器一般是你接入的`ISP`提供的服DNS服务器。

UNIX系统中，在`/etc/resolve.conf`文件中查看DNS服务器的IP地址
![](/blog_assets/DNS_2.PNG)

也可以指定直接使用某一个DNS服务器

![](/blog_assets/DNS_5.PNG)  

##### 2️⃣ 域名分级查找 
域名分级 ： `主机名` `次级域名` `顶级域名` `根域名`   
☎️ 根域名所有的都一样，都为`.root`  
☎️ 顶级域名，一般为常见的`.com` `.net` `.cn` `.edu`  
☎️ 次级域名就是我们常见的 公司名称 ，例如`.taobao` `.baidu` `.alibaba`   
☎️ 主机名一般为子域名称，例如  
 百度地图中 `https://map.baidu.com`中的`map`    
 百度图片中 `https://image.baidu.comn`中的`image`  

查找过程先后： 先查找根域名服务器，再是顶级域名服务器，再是次级域名服务器。

其中，最开始的根域名服务器ip地址，全世界限定了十多台根域名服务器，不需要去获取他们的IP地址，一般都直接内置DNS服务器中。   

![](/blog_assets/DNS_6.PNG) 

主机去询问域名服务器的地址...  


### 其他命令工具
##### `host`命令  
![](/blog_assets/DNS_7.png) 

##### `nslookup`命令
![](/blog_assets/DNS_9.png) 


##### `whois`命令
![](/blog_assets/DNS_8.png) 


### DNS与前端优化 
1️⃣ DNS的查询时间也包括在我们访问网站的响应时间内，一般为20-120毫秒的时间，所以减少DNS查询时间，是能够有效减少响应时间的方法。  



[MDN原文](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control) 👉
> The X-DNS-Prefetch-Control HTTP response header controls DNS prefetching, a feature by which browsers proactively perform domain name resolution on both links that the user may choose to follow as well as URLs for items referenced by the document, including images, CSS, JavaScript, and so forth.

> This prefetching is performed in the background, so that the DNS is likely to have been resolved by the time the referenced items are needed. This reduces latency when the user clicks a link.


##### 兼容性
![](/blog_assets/DNS_10.png) 
感动得流泪...IE6-8竟然都支持...  

##### 使用
我们来看看剁手网是怎么用`prefetch`的  
![](/blog_assets/DNS_11.png)

```html
<link rel="dns-prefetch" href="http://www.next-resource.com/">
```

___
### 参考文章  
[阮一峰 - DNS入门](http://www.ruanyifeng.com/blog/2016/06/dns.html)   
[前端优化与DNS](https://www.cnblogs.com/rongfengliang/p/5601770.html)