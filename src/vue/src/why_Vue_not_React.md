## 为啥使用Vue而不是React
> vue 与 react 优缺点大比较

## 为什么是用Vue
适用于改造旧项目     
更容易改善历史代码     
webcomponent模式     
`function`组件模式     

## react的缺点
* 复杂而可读性较差的JSX
* 每个组件都有自己的方法，属性、顺着组件层级的单向数据流


#### 监听数据变化的原理不一致
`vue`  
通过getter/setter的劫持，也能精确的知道数据变化，并不需要特别的优化就能达到更好地性能。     


`react` 
默认是通过比较引用的方式进行的，若不进行优化，则可能导致大量不必要的VDOM进行了重新渲染。     


#### 数据流向的不一致  
`vue 1.x`  
父组件与子组件还有DOM之间，都是双向数据流。    

`vue 2.x` 
父子组件之间，数据流是从父组件单向流向子组件，子组件和DOM之间仍然实现的是双向数据流。       


`React`   
父组件子组件还有DOM对象之间，实现的都是单向数据流。        

单向的数据流有利于数据错误的排查，

#### 组件通信上的策略差别     
`Vue`      
* 父组件通过`props`传递参数到子组件  
* 子组件通过事件机制(自定义事件，然后父组件监听)......来处理子组件向父组件的通信     
* 通过`provide/inject`来实现父组件向子组件注入数据     

`React`     
* 通过`props`传递参数到子组件   
* 通过`context`进行跨层级的通信，和`provide/inject`起到的作用差不多     
* 通过回调函数，因为`React`的组件更像是一个函数，所以在`react`中一般都是通过`传入回调函数`的方式进行通信。      

#### 渲染机制  
`Vue`      
vue则是通过类似于HTML的template进行解析。


react是通过JSX语法的进行DOM的解析。渲染时候使用render函数进行渲染。    render函数也支持闭包特性。     

##### Vuex 与 Redux
而vue使用的是可变数据，每次的修改都在原来的数据对象上修改。Vuex监听数据的变化，使用的还是数据的getter/setter劫持。

`Redux`使用的是不可变的数据，每次都是用的是新的`state`替换的是旧的`state`，redux使用的是diff算法     

##### react的 api更少





#### 混入策略  
`vue`    
使用的是mixin的策略   

`React`    
使用的是HoC高阶组件。