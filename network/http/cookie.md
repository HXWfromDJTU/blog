# cookie

#### 不可跨域使用  
1️⃣ cookie中的domin设置的跨域是指跨子域名都不可以访问,例如`www.baidu.com`和`map.baidu.com`是不可以跨域进行读取内容的。  

2️⃣ `cookie_devtool`



![](/blog_assets/cookie_devtool.png)  




![](/blog_assets/cookie_set.png)



#### cookie和session体系 
服务端维护一个session，产生一个sessionID，通过http返回给客户端并保存在cookie中，然后在超时时间范围内，每次访问该域名都会携带sessionID到服务端，服务端再根据sessionID找回session。   

session在服务端是会占用服务端的资源和内存，所以服务端需要维护session的数目，以防内存的溢出。   

若出现分布式下需要维护一个同一个session，则需要使用一个单独的session服务器去维持访问。   


##### 关于同源
协议+端口+域名，三者统一才能确定是同源。    





