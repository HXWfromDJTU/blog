## 前言
这里收集下工作中遇到的跨域问题....持续更新

## CDN下的字体文件
* 博主上周给公司`web项目`上了`CDN加速`。开发使用的是`nuxt.js`，在`nuxt.config.js`的配置中很快滴配置好了`static.xxx.io`的`CDN`域名。测试后发现，所有`js``css`、`image`资源都正常，除了项目中的`material-design.woff2`字体文件加载失败了。
  ```css
  /* fallback */
  @font-face {
   font-family: 'Material Icons';
    font-style: normal;
    font-weight: 400;
    src: url(./material.woff2) format('woff2');
  }
  ```
  ![](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/blog_assets/cnd_font_cors.png)

* 问题原因: `字体文件请求`是从我们自己的网站发起的，而请求的是`CDN`资源库上的`字体文件`，明显是you跨域的情况存在。
* 解决办法
  * 博文使用的是 `阿里云`,直接在`CDN`服务后台添加上跨域白名单即可。[参考这里](https://www.vicw.com/groups/cats_and_dogs/topics/223)
  * 若是自己的`CDN`服务，那就自行在对应机器上的`nginx`或者服务上加上返回头 `Access-Control-Allow-Origin: 'your.domain.com'`    

## Script Error 与 crossorigin
问题出现的过程:
1. test.com 下的页面引用了属于 http://other-cdn-domain.com 的 `target.js` 文件  
2. 在 test.js 运行过程中发生了错误，因为第三方隐私安全的原因，浏览器不会把错误信息报出来。 

如何解决: 
1. 给`script`标签增加 `crossorigin` 属性，让浏览器允许页面请求资源。
    ```html
    <script src="http://other-cdn-domain.com/static/target.js" crossorigin>
    ```

2. 参考 CORS 规范，在资源服务端返回跨域头 `Access-Control-Allow-Origin: test.com`
    * 自家的服务器请自己手动添加
    * 若是启用了 CDN 服务，一般服务商的资源配置页面，支持设定返回的请求头

3. 最后就可以可以在控制台中看到 跨域脚本 下的 js 执行异常了。

## `Allow-Origin: *` 与 `withCredentials = true`
想要跨域请求携带`cookie`，但服务端允许跨域的端口却是`*`的话，听起来就是矛盾的。
![](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/blog_assets/with-credentials-error.png)

所以服务端需要同时设置二者: 
```bat
add_header "Access-Control-Allow-Origin" "http://fedren.com";
add_header "Access-Control-Allow-Credentials" "true";
```

## 不一定是跨域
在日常开发调试中，博主在搭配使用`whistle`作为代理服务器进行调试时，应用运行在`Chrome` 的某些版本下。后端接口返回 `5xx` 的异常，`Chrome Dev Tool` 中会显示与接口跨域调用失败一样的错误。   

(截图待补充......)

不知道 `whistle` 是啥?[去看看👉](https://juejin.im/post/6861882596927504392)   

## 参考资料
[1] [阿里云 CDN 字体fonts跨域问题](https://www.vicw.com/groups/cats_and_dogs/topics/223)    