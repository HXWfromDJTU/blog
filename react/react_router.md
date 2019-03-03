#  快速上手react 之 react-router 
> 继续从 vue 技术栈迁移到react   

##### react-router 和 react-router-dom的区别是什么？
react-router-dom 依赖于 react-router中导入了相应的组件。我们在web开始的时候，只需要显式地安装`react-router-dom`，在原生跨平台开发的时候安装`react-router-native`，npm自然会在内部依赖的安装的时候，隐式地帮你安装好`react-router`。

`react-router` 
```js
{ Switch, Route, Router };
```
`react-router-dom` 
```js
{ Switch, Route, Router,HashHistory,Link};
```
`react-router-native` 
```js
{ Switch, Route, Router };
```


NavLink 类似于  router-link   

Route组件要包含在 Router组件中  ， 这里的router也就是Browser-Router

Switch组件   


LocaleProvider？？  


##### React-router-redux     