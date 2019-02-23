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