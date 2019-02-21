# vue-router源码解析

支持`hash` `history`  `abstract`三种模式。  

提供了 `<router-link>` 和 `<router-view>`梁总、、两种`DOM`型组件。  


vue-router 是vue插件，肯定会调用 install方法进行安装。  

将`beforeCreate`和`destory`钩子函数注册到每一个组件中。      
在全局 Vue.component 挂载 `<router-link>` 和 `<router-view>`两个组件。     
