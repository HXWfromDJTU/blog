
Block Formatting Content也就是我们熟悉的BFC

盒的类型由`display`属性决定。        


`块盒(block box)`  

##  视觉格式化模型  


### 三种定位方案   

在定位的时候，浏览器会根据和类型和上下文对这些元素进行定位，可以说盒就是定位的基本单位。常规流、浮动和绝对定位是三种最常见的定位方式。    


##### 常规流(Normal flow)   
* 在常规流中，




##### 浮动


### 创建BFC的方法   
根元素或者包含着它的元素    

使用浮动   

position:fixed   

display:inline-block   

display:table-cell   

overflow:hidden   

display:flex   

### BFC的作用  

BFC最显著的效果就是建立一个隔离的空间，断绝空间内外元素间相互的作用，然而，BFC还有更多的特性。    

BFC就是一个页面上的隔离的独立容器，容器里的元素和容器外的元素都不会相互影响， 

一个BFC盒子中的各个元素之间，可能会发生margin collapse，崩塌。（也就是垂直方向上的margin会相互吃掉，大的值会覆盖小的值）。 


考虑BFC高度的时候，要考虑BFC所包含的所有元素，连浮动元素也参与计算。  ✅   



一个元素不能够同时存在两个BFC之中。   


使用BFC隔离内外环境的影响，可以用于清除浮动。    


利用BFC也可以实现盒子内闭合浮动。   



___
### 参考文章
[学习 BFC (Block Formatting Context) -by 网易考拉](https://juejin.im/post/59b73d5bf265da064618731d)



