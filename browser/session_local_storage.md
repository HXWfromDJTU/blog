# sessionStorage  && localStorage && cookie

###  cookie 
1️⃣ 同浏览器对针对每个域的cookie数目也有限制，一般为50个左右，所有域所有cookie加起来，总大小只有4kb。
2️⃣ 只要域名匹配上了，所有的请求都会跟着发送过去。  
3️⃣ cookie提供的接口都比较原始，需要封装过后才能使用。  
4️⃣ 他的主要职责是用于储存常常用于和服务端交互的数据，比如账号密码等，不建议存储前端页面间的各个参数。


### 本地存储
1️⃣ 大小调整到有5MB  
2️⃣ 请求的时候不会自动被带入  
3️⃣ 适合存储数据，叶面间的共同数据   
4️⃣ localStorage和sessionStorage在使用时候，尽量使用`try-catch`进行包裹📦  

### sessionStorage  
1️⃣ `sessionStorage`消失的时间是用户关闭浏览器，或者关闭sessionStorage所在的页面标签。  
2️⃣ `sessionStorage`不可以跨页面访问  


### localStorage  
1️⃣ `localStorage`内容在浏览器关闭之后，并不会消失。
2️⃣ 除非用户手动删除`localStorage`,或者用户手动轻轻浏览器缓存。
3️⃣ `localStorage`可以跨页面访问，协议号+主机名+端口号一同确认一个文档源。


