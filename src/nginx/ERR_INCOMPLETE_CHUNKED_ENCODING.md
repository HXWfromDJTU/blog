## nginx buffer

> 最近在布置工作室官网的时候，项目在本地跑得十分顺畅，但是到CentOS 机器那边就出现了奇怪的问题。先简单描述一下技术栈。
* nuxt.js
* centOS
* nginx

nginx 用的是官方推荐de配置
```conf
server {
    listen          80;             # the port nginx is listening on
    server_name     your-domain;    # setup your domain here

    gzip            on;
    gzip_types      text/plain application/xml text/css application/javascript;
    gzip_min_length 1000;

    location / {
        expires $expires;

        proxy_redirect                      off;
        proxy_set_header Host               $host;
        proxy_set_header X-Real-IP          $remote_addr;
        proxy_set_header X-Forwarded-For    $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto  $scheme;
        proxy_read_timeout          1m;
        proxy_connect_timeout       1m;
        proxy_pass                          http://127.0.0.1:3000; # set the address of the Node.js instance here
    }
}
```

Chrome devtools显示的结果
![](/blog_assets/nginx_err1.jpeg)

服务端这边的错误
![](/blog_assets/nginx_err2.png)



___
### 参考文章
[net::ERR_INCOMPLETE_CHUNKED_ENCODING nginx - stackoverflow](https://stackoverflow.com/questions/29789268/neterr-incomplete-chunked-encoding-nginx)