# 浏览器存储方案
![](/blog_assets/browser_storage.png)


常用的存储：`sessionStorage`  && `localStorage` && `cookie`

###  cookie 
1️⃣ 同浏览器对针对每个域的cookie数目也有限制，一般为50个左右，所有域所有cookie加起来，总大小只有4kb。
2️⃣ 只要域名匹配上了，所有的请求都会跟着发送过去。  
3️⃣ cookie提供的接口都比较原始，需要封装过后才能使用。  
4️⃣ 他的主要职责是用于储存常常用于和服务端交互的数据，比如账号密码等，不建议存储前端页面间的各个参数。  
生命周期：


### 本地存储
1️⃣ 大小调整到有5MB  
2️⃣ 请求的时候不会自动被带入  
3️⃣ 适合存储数据，叶面间的共同数据   
4️⃣ localStorage和sessionStorage在使用时候，尽量使用`try-catch`进行包裹📦  
5️⃣ 无痕模式下，许多浏览器的sessionStorage和localStorage会无效   
#### chrome  
两者的初次使用都正常,但是`localStorage`在关闭页面后，再次打开，就会失效
 
![](/blog_assets/chrome_notrace_storage.png)  

二次打开页面，无法获取到上一次的key,说明浏览器给我们自动清理了。
![](/blog_assets/chrome_notrace_storage2.png)  

#### firefox
直接在无痕模式下，两者都无法使用......简单粗暴

![](/blog_assets/firefox_notrace_storage.png)

#### safari 
结果和Chrome 一毛一样...
![](/blog_assets/safari_notrace_storage.png)  

![](/blog_assets/safari_notrace_storage2.png)  

话说...真的有人跟着这里投简历入熊厂？？？不如直接在这里发面试题提前筛选一波...  
### sessionStorage  
1️⃣ `sessionStorage`消失的时间是用户关闭浏览器，或者关闭sessionStorage所在的页面标签。  
2️⃣ `sessionStorage`不可以跨页面访问


### localStorage  
1️⃣ `localStorage`内容在浏览器关闭之后，并不会消失。
2️⃣ 除非用户手动删除`localStorage`,或者用户手动轻轻浏览器缓存。
3️⃣ `localStorage`可以跨页面访问，协议号+主机名+端口号一同确认一个文档源。  
4️⃣ `localStorage` 的有效范围仅在同域名下   
##### 出现问题
我们在不同网站下做的测试,在`baidu.com`下set进去的值，无法在`hupu.com`上get到。
![](/blog_assets/localstorage_domin.png)  

在不同的domin下可以取到值，在不同的domin下不能取到值

![](/blog_assets/localstorage_domin2.png)  
![](/blog_assets/localstorage_domin3.png)  





___
### 参考文章
[HTML5 localStorage与document.domain设置问题](https://www.cnblogs.com/wangxiang/p/3332797.html)   

[浅谈localStorage跨域的解决方案——postMessage和iframe](https://blog.csdn.net/zhouziyu2011/article/details/61209268)




