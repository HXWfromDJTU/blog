# CSRF_XSS简介

![](/blog_assets/CSRF_XSS_COVER.png)
### 简介 
1️⃣ 从小听到大的SQL注入攻击，在现在的大型项目中，基本很能够实现。因为从用户输入到sql查询都会进过多层的校验，sql注入基本很难实现。   
2️⃣ 但是和sql注入相类似，都是让系统在不知不觉中，执行了一段恶意代码，这就是`XSS`和`CSRF`。 


### XSS 
XSS(Cross-Site-Scripting)
##### 攻击原理
1️⃣ 攻击者通过网站开发这提供的提交接口（比如发表评论、上传内容等...），提交一些带有恶意代码的内容  
2️⃣ 当下一次其他用户加载这些评论内容的时候，这些恶意内容就会自动运行，也许是获取客户`cookie`中的内容，也许是弹出一些广告  
3️⃣ 因为无论是开发者的JavaScript代码，还是攻击者的JavaScript代码，对浏览器的权限都是顶级的(除非是一些安全模式，[沙箱模式](https://www.cnblogs.com/slly/p/6639173.html))   

##### 防范措施 
1️⃣ 既然是攻击者提交的内容有问题，那么我们就把攻击者提交的内容进行字符串检验，把JS执行一些必须的常用的符号进行替换，而后再保存在数据库中。这样其他用户读取到的内容可能是稀奇古怪的内容，但是大大降低了出现XSS攻击的几率。  
2️⃣ 常见的XSS攻击都是为了获取我们保存在cookie中的账号密码信息。那么我们作为网站开发者，可以再返回的报文中，将本次的`cookie`缓存设置为`http-only`，也就是发送请求时候带上，但不能够在本地使用Javascript去获取到。   

以下是Java Server设置返回报文的例子 
```java
response.setHeader("Set-Cookie", "cookiename=value;
Path=/;Domain=domainvalue;Max-Age=seconds;HTTP-Only");
```

### CSRF
CSRF(Cross-Site-Request-Forgery) 

##### 攻击原理
1️⃣ CSRF和XSS的偷窃cookie信息攻击方式不同，CSRF是利用你的cookie信息(不需要获取出来)，用你的身份去帮助他完成一些请求  
2️⃣ 比如你正在浏览`HUPU`首页，cookie中有你之前就保存过的账号密码信息，你正在浏览自己的勇士球队区。此时，有人给你发了一封邮件，里面包含了一张图片，图片的url是 
`http://hupu.com/Lakers/post?title=勇士总冠军`
图片自然加载不出来，但是很可能浏览器就帮你自动发送了一片名为`标题`为`追梦是脏B...`的文章，你可能就被关到小黑屋了...莫名奇妙的哦。  

3️⃣ 看起来发了一篇文章没有什么，但是要是这个操作是转账操作呢？....
`http://alipay/payment?toUserid=15016132387` 
当然，阿里转账的接口不会有这么简单...但这是因为大厂有这个方法的思维，要是小厂分分出问题钟呗。 

##### 防范措施 
1️⃣ 明眼的同学就能看出，切，我换POST请求不就行了嘛。这是一条路子。  
2️⃣ 设计支付这种破坏性的操作的，建议使用更高级的身份验证形式，比如验证指纹，或者重新输入密码等等...



### 参考文章
[浏览器的沙箱模式](https://www.cnblogs.com/slly/p/6639173.html)  

[前端优化 - by Alex 百度](https://juejin.im/book/5a8f9ddcf265da4e9f6fb959/section/5a8f9f7bf265da4e82635e46)  

