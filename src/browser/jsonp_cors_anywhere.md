
## 前言
前面一篇文章聊过了最常用的跨域手段 `CORS` (跨域资源共享)。这次再看看工作中其他的跨域资源获取手段，`proxy` 和 `JSONP`。  

## proxy

### 使用的场景
同源策略的是浏览器本身管理资源的安全策略，并且以域来划分管理。但是当企业发展、业务变得繁杂之后，一个页面需要的资源来源，可能是数十个。

与每个接口的提供方进行进行沟通，让其进行在响应中添加对应的 `Access-Controll-Allow-xxxx` 的响应头是在过于繁琐，万一自己网站的域名做了调整，又需要对所有的接口提供方进行更新。

### 解决的原理
通过一个中间服务器为我们的 `web服务` 进行请求转发。Proxy 与数据接口之间可以直接调用，Proxy Server 与 web应用 之间且存在的跨域问题，只需要使用一次 `跨域响应头` 的设置即可。

![](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/blog_assets/proxy-server-diagram.png)

### 实现方案
Proxy Server 是一个最简化的 `http Server`，不进行任何的业务处理，只对请求原封不动地转发，对相应数据也原封不动地返回给请求方。

常用的实际方案是 `Node.js 转发` 与 `nginx 转发`，为啥选她俩？因为足够轻量足够快，前端可以闭环。 

#### cors-anywhere
[cors-anywhere](https://github.com/Rob--W/cors-anywhere) 是一个开箱即用的 Node.js 转发服务，专门为中转请求而设计。前端开发将其部署到自己的服务器上
```js
return axios.get('https://cors-anywhere.your-server.com/https://api.other-domain.com/price', {
        params: { ids: tokens.join(',') },
        withCredentials: false,
    })
```

#### nginx 代理
```conf
#进程, 可更具cpu数量调整
worker_processes  1;

events {
    #连接数
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;

    #连接超时时间，服务器会在这个时间过后关闭连接。
    keepalive_timeout  10;

    # gizp压缩
    gzip  on;

    # 直接请求nginx也是会报跨域错误的这里设置允许跨域
    # 如果代理地址已经允许跨域则不需要这些, 否则报错(虽然这样nginx跨域就没意义了)
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Headers X-Requested-With;
    add_header Access-Control-Allow-Methods GET,POST,OPTIONS;

    # srever模块配置是http模块中的一个子模块，用来定义一个虚拟访问主机
    server {
        listen       80;
        server_name  localhost;
        
        # 根路径指到index.html
        location / {
            root   html;
            index  index.html index.htm;
        }

        # localhost/api 的请求会被转发到192.168.0.103:8080
        location /api/ {
            rewrite ^/b/(.*)$ /$1 break; # 去除本地接口/api前缀, 否则会出现404
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass ?; # 转发地址
        }
        
        # 重定向错误页面到/50x.html
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

    }

}
```

## JSONP
假设代理服务始终是麻烦的，JSONP 方案的灵活性这体现了出来。淘宝、天猫、京东的等电商网站的首页数据，无一例外地使用了 JSONP 的数据请求方式。    

原理则是“欺骗浏览器”，告诉浏览器我用换这个script 标签获取回来的只是一些执行脚本，并不是数据，而让浏览器不进行资源访问的域限制。     

![](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/blog_assets/taobao_jsonp_2.png)  

![](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/blog_assets/taobao_jsonp_1.png)   


#### 缺点
* 只能够使用 GET 请求
* 由于安全性的限制，一般只能设计为对服务器无损的数据请求   
* 因为要拼接在返回的函数毁掉中，承载的数据量相对比较小     


#### 优点
* 浏览器的兼容性更好   

## 参考资料
[1] [JSONP - Wikipedia](https://en.wikipedia.org/wiki/JSONP)      
[2] [跨源资源共享（CORS） - MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS)     