### Vue-router 实现原理

实现更新视图，但不刷新页面，可以有两种方式实现
* 利用URL中的hash
* 使用History Interface 早HTML中的新增方法

在 `vue-router` 中是通过mode这一个参数来实现，选择使用哪一种实现方式
```js
const router =new VueRouter({
    mode:'history',
    route:[...]   //用户配置的路由表
})
```

* 可以为hash的改变添加监听事件：
>window.addEventListener("hashchange", funcRef, false)
