# elementUI 源码学习  $message    


##### 组件入口
> element/src/index.js
```js
import Message from '../packages/message/index.js';

Vue.prototype.$message = Message;   
```

##### 实现动画效果的的主要代码
> packages/theme-chalk/message.scss
```css
.el-message-fade-enter,
.el-message-fade-leave-active {
  opacity: 0;
  transform: translate(-50%, -100%);
}
```

