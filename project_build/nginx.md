# Nginx 你也要懂的三两点
> nginx 这次词语，题主的第一印象是《2012》电影里，那个俄国大熊在飞机上语音启动她的豪车....engine start....

### Nginx Start
`nginx -t && nginx -s reload`

### nginx常见知识点
1️⃣ 默认监听 `80` 端口    


### 请求转发

### 跨域处理
```conf
server{
    listen 80;
    server_name localhost
    location / { #设置拦截路径
       proxy_pass https://www.domin2.com:9527 # 反向代理到另一处 
       proxy_cookie_domain localhost www.domain2.com

       # 添加跨域请求头 
       add_header Access-Control-Allow-Origin:*;
       add_header Access-Control-Allow-Method:GET,POST,OPTION;
       add_header Access-Control-Header: XXX-SSS-QQQ; # 跨域请求时额外允许添加的请求头
    }
}
```

#### 实现简单的访问限制 
```js
location / {
        deny  192.168.1.100;
        allow 192.168.1.10/200;
        allow 10.110.50.16;
        deny  all;
  }
```
#### 识别设备
```js
location / {
        # 移动、pc设备适配
        if ($http_user_agent ~* '(Android|webOS|iPhone|iPod|BlackBerry)') {
            set $mobile_request '1';
        }
        if ($mobile_request = '1') {
            rewrite ^.+ http://mysite-base-H5.com;
        }
    }  
```  

#### 负载均衡  

___
### 参考文章
https://juejin.im/post/5bacbd395188255c8d0fd4b2