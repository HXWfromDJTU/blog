


## 总体设计
先了解工作原理，再去看源码怎么实现。不要从代码中反推Vue流程。      


## 笔记
* 烂大街的问题
* 考察你的深度
* 考察知识面  
* 若何做到脱颖而出
* 框架常见的缺点缺陷，在项目中如何避开   
* 面试官考察到的知识点，若了解过对应的源码，最好也跟着补充上     

## 题目
* v-if 与 v-for 的  

## 需要补足的点
* DOM 的 diff 算法
  * virtual-dom
  * patch 算法的实现原理
    * patch 方法
    * Vue.prototype._update 方法
    * updateChildren 方法 (在 patch.js里面)
  * key 的作用
  * sameNode 函数的理解
  * 深度优先算法的书写      

* 源码中 watcher 的实现

* 了解实现双向绑定实现的流程          
* 手写实现一个最基础的双向绑定     
  
## 混沌笔记
Vue 暴露出来的就是一个 Vue类，

nuxt.js 中的 asyncData 与 created 有什么关系 

单文件组件时，写 Vue.extend、直接对象 和 new Vue 有什么不同呢？

Vue 列表绑定事件的时候，需要使用事件委托吗？

V-model.lazy 是什么意思？

provide 与 inject 可以在项目中什么场景落地。
 * 为什么一般的业务中不使用呢？   
 
 mixin 的合并策略是怎么样的呢？覆盖的策略呢？
 vue 3中的 compositApi 是什么样的呢？    
 
 异步组件如何去实现呢？  
 
 keep-alive 的使用以及原理？    
 
  


