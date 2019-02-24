# React 点滴起步
> 接触 mvvm 做项目已经过去一年的时间，准备使用端时间学习第二个mvvm框架。

## 从源码起步

## 待整理
*  render方法接受的是一个jsx代码，可以将jsx转化为js代码执行   



### 通关点   
1️⃣ jsx   
2️⃣ react-dom 和 react的render 方法的底层实现       
3️⃣ react-router   
4️⃣ react生命周期     
5️⃣ react的state    
6️⃣ react的数据流，父子组件通信       
7️⃣ react的redux，如何使用，优缺点    
8️⃣ react-logger   redux-thunk   redux-promise          

### 面试角度切入  
##### 如何理解 react？ 哪家公司开源的？  是MVVM还是MVC？  

##### react 的特点？     

##### 使用render函数的时候，若多个元素嵌套的时候需要注意些什么呢？     


##### 为什么虚拟dom能够提高性能？  

##### diff算法

##### flux思想   

### 参考资料  
[文章1](http://www.cnblogs.com/cangqinglang/p/9188466.html)  

[生命周期](https://segmentfault.com/a/1190000004168886?utm_source=tag-newest)   



##### React Fiber 
16.X之后的版本      
改良了什么
分片的概念，复杂动画进行了优化    


##### JSX
onClick   
jsx中DOM事件处理，需要注意this的指向问题。 所以常用 bind(this)  

使用setState进行更新state

循环列表中需要制定 key值    

从input数据框读取数据的例子中看出，react提倡的是单向的数据流，徐亚欧任何的数据绑定都需要进行手写   
```jsx
<input value={this.state.inputValue}  onChange={this.handleInputChange.bind(this)}>
```

setState的操作，与vue中不同的是，这里每次都是使用一个新的数据变量去替换掉了旧的数据变量，而vue中是修改当前的变量。    
也不建议直接修改state中的值，都是通过拷贝副本，修改副本，最后再set回去     

组件的分割     
父组件通过属性的方式     

子组件向父组件通信，只能通过父组件传递给子组件的回调函数，子组件调用该函数，通过参数暴露要传递的参数。

需要提前 bind(this) 有利于提升性能。   
多使用解构赋值。      
将复杂的jsx DOM结构使用一个函数代替。    

标签的class类名使用className代替。     

React.Frangment代替无含义的 div，也就是 React中的 Fragment对象
```jsx
<Fragment> 
    <div>xxxx</div>
    <ul>bbb</ul>
</Fragment>
```

react如何实现嵌套路由，一个路由页面内，再嵌套多个路由   


Router Route IndexRoute组件 之间的层级关系   

Link组件 activeClassname的属性    IndexLink又是什么鬼？ 

高阶组件     
高阶组件就是一个函数，接受的参数就是一个/多个组件，并且返回一个新的组件。     
高阶组件和高阶函数的定义基本一样，高级组件不是一个组件，而就是一个高阶函数。     
这个高阶组件有些像是一个组建的工厂，在内部进行组件的组合拼装，最后返回一个组件。     

高阶组件的使用   
一、直接当做函数调用   
二、使用装饰器会进行调用(注意需要配置@decorator转译)    

##### 代理方式的高阶组件   
返回新组建，直接继承自React.Component类,而传入的组件就是扮演新组件的一部分的角色。     

使用给wrapperComponent 传递 refs ，这样就可以获得ref的所有功能，容易出错，所以建议不使用。
```jsx
   refc(instance){
      instance.func()// 可以直接调用传入的 wrappercomponent 的方法
   }
   render(){
       return (
        <WrapperComponent sex="xxx" ref={this.refc.bind(this)}>
       )
   }
```

如何实现状态抽取
![](/blog_assets/proxy_react_component.png)



##### 继承方式的高阶组件     
返回的组件，直接继承自WrappedComponent   
React.cloneElement() ???    

高阶组件的名称，在默认的情况下，返回参数组件的名称，那么在调试的时候就很不方便，则去修改 方法的一个静态属性， 
```jsx
static displayName = 'MyComponent';
```

##### 综合考虑  
优先考虑代理的情况使用高阶组件，而不是继承的方式

rcc快捷键  

 

 ##### 其他
 ```jsx
<Router>
   <Switch>
      <Route path="/" component={}>
      <Route path="/car"  component={}>
   </Switch>
</Router>

<Link></Link>
 ```

高级组件有利于组件的自由组合，组件的复用     


组件就像是一个函数似的，接受特定的输入(props),产出特定的`React elements`。      

react是不建议去直接修改传入的props函数的。       




### 生命周期   

##### getDefaultProps()   
在一个组件中只会被调用以一次，该组件的所有后续应用，getDefaultProps都不会被再次调用，其返回的对象可以用于设置默认的`props`值。     

##### getInitialState()  
对于组建的没和实例来说，这个方法的调用只有一次   


##### componentWillMount()   
在首次渲染前调用，也就是在render方法调用之前，修改state的最后一次机会。     

##### render()   
传建一个虚拟的dom结构，用来表示组建的输出，对于一个组件来讲，render唯一一个必须的方法。

##### componentDidMount()   
该方法被调用的时候，已经渲染出真实的DOM，可以在该方法中，通过`this.getDOMNode()`访问到真实的DOM。
通过 this.refs.componentName.getDOMNode 来获取对应的真实的DOM。     
##### componentWillReaciveProps    
组件的属相呗父组件更改了，这时候componentWillReceiveProps将会被调用，可以在这个方法里面更新state,以触发render方法重新渲染组件。        

##### shouldComponentUpdate   
通过这个方法可以手动控制组件是否更新。内部可以通过检测props的变化情况，结合自身的业务逻辑，最后返回一个boolean值来决定，是否要更新DOM。这样有助于减少不必要的渲染，从而优化性能。     
若为false,则后续的 render、componentWillUpdate、componentDidUpdate也不会被执行。     
##### componentWillUpdate        
该周期是在组件接受到了新的参数，即将进行重新渲染的时候触发。     

##### componentDidUpdate     
在组建被重新渲染之后，这个方法被调用。     

##### componentWillUnmount  
在组件被移除之前调用，一般在这个阶段做一些请理性的工作，比如取消一些定时器，释放一些资源等等。     