# 收集一些 axios开发遇到的问题

Q：错误代码如下：
> Uncaught (in promise) TypeError: **Cannot read property 'protocol' of undefined**
查找资料后，发现原因是:
```js
import axios from 'axios'
Vue.use(axios); //使用了Vue.use来引入 axios插件
```
解决方法：
```js
Vue.prototype.axios = axios;
```

