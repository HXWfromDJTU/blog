#Vue SSR 回顾
### SSR 优点
* 更利于SEO
* 利于首屏渲染

### SSR 劣势
* 服务端压力变大，特别是当用户量特别大的时候。
* 在后端渲染中，只会触发`create`和`beforeCreate`两个钩子，不利于其他业务的展开

### 与Vue preRender的区别

### 使用前先考虑我们是否需要SSR

### 是否考虑使用 phantomjs 代替实现