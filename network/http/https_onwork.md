# https项目迁移技巧
___
#### 可动态切换的协议
* 为了程序的健壮和灵活。HTTPS使用之前，我们需要把以前使用HTTP协议的链接，改为可以根据情况不同，自动变化的动态协议
* 当用户访问HTTPS资源出错时候，自动改为请求对应的HTTP资源

#### 状态码 301 与 302 的差别
* 302 重定向是临时性的，下次浏览器再次访问的时候，会再次访问原链接
* 301 状态是永久重定向，适合在更改HTTPS服务后，观察一段时间稳定时，使用301重定向
总结：当所有的服务都改为HTTPS请求之后，将用户的HTTP请求，使用ngin`302`重定向到HTTPS的请求中去，实现强制切换。

#### 使用 meta标签头信息，实现 HTTP转HTTPS

###### 使用`block-all-mixed-content`阻止HTTP请求
```html
<meta http-equiv="Content-Security-Policy" content="block-all-mixed-content">
```
###### 使用`upgrade-insecure-request`进行HTTP请求转换
* 站点内的HTTP请求，会自动改为HTTPS的形式发起
* 跳转链接也会以HTTPS的形式获取页面
* 在确认HTTPS服务能够正常支撑日常业务的时候，应该切换到HTTPS服务
```html
<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
```