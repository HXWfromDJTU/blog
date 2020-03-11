# https证书申请
![](/blog_assets/on_flower.jpg)

> 最近工作室的官网准备要上线了，也因为https的普遍使用，https的原理读得多了，现在就来实操一次，为网站建立https证书吧。

### 申请流程
> 以腾讯云(免费)申请流程为例子

![](/blog_assets/ssl-step1.png)


### 服务器配置ssl证书
> nginx版本
##### 1、下载证书包
请根据自己的服务器平台选择证书包

![](/blog_assets/ssl-step3.png)
![](/blog_assets/ssl-step4.png)


##### 2、上传证书文件到服务器
使用`scp`等方法把证书放到服务器的`conf`目录，例如
```
$ scp xxxss.com_bundle.crt xxxss.com.key xxx.xxx.xxx.xx:/usr/local/nginx/conf/cert
```

##### 3、(补充)安装 `with-http_ssl_module` 模块
在你安装nginx的目录下(这里要注意，不是`/usr/local/nginx`这个，一般会是nginx.10.x.x带版本号的那个，下面有一个`configure`可执行文件)，用它来安装这个`ssl`模块
![](/blog_assets/ssl-nginx.png)
```
$ ./configure --with-http_ssl_module
```
然后在同样目录下执行`make`命令
```
$ make
```
然后备份之前的nginx，再将新配置的nginx覆盖掉旧的
```
$ cp /usr/local/nginx/sbin/nginx /usr/local/nginx/sbin/nginx.bak
```
```
$ cp objs/nginx /usr/local/nginx/sbin/nginx
```
哦对了~👆上面这个覆盖文件会需要你停止当前的`nginx`，避免你又查了，给你搬运过来了
```
$ nginx -s quit # 等待当前程序执行完后退出
$ nginx -s stop # 强制停了吧
```

##### 添加配置
```
 server {
         listen 443;
         server_name xxxxxxxx.club;  # 此处为您证书绑定的域名。
         ssl on;   # 设置为on启用SSL功能。
         location / {
            proxy_pass http://nuxtSSR; # 前面配置的一个前端项目
         }
         # SSL 证书配置
         ssl_certificate cert/1_woniuhuafang.club_bundle.crt; # 您证书的文件名。
         ssl_certificate_key cert/2_woniuhuafang.club.key; # 证书的私钥文件名。
         ssl_session_timeout 5m;
         # 使用此加密套件。
         ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
         ssl_protocols TLSv1 TLSv1.1 TLSv1.2;   # 修改protocols。
         ssl_prefer_server_ciphers on;
      }

```


搞定之后检测一下语法没问题就重启happy吧
```
$ nginx -t # check 一下
$ nginx
```

##### 完结阶段撒花
哇咔咔，小锁头被解开啦 🙃
![](/blog_assets/ssl-nginx-final.png)


### 错误回收站
##### 1、ssl 前置标志符号不再推荐使用
>[warn] the "ssl" directive is deprecated, use the "listen ... ssl" directive instead

移除 `ssl on`配置，修改`listen 443` 为 `listen 443 ssl`