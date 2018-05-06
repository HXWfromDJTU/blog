# Vuex回顾
### vuex是啥
* vuex是一个前端的数据仓库，可以类比与`cookie`、`sessionStorage`、`localtionStorage`
### 来一个小demo
* store.js
```js
import vue from 'vue';
import vuex from 'vuex';
// 数据状态状态管理
const state = {
    count:3
}
// 使用mutataions中的方法对state中的数据进行操作
const mutations = {
    add(state){
        state.count ++;
    },
    reduce(state){
        state.count--;
    }
}
const getters = {
    count:function(state){
       return state.count +=200;
    }
}
const actions={
    // action中可以调用mutataions中的方法
    addAction(context){
        // 这里的context相当于 本文件
     context.commit('add',10);
    },
    reduceAction({commit}){
    commit("reduce");
    }
}
//暴露
export default new Vuex.Store({
    state,mutations,getters,actions
})
```
### 映射关系
* 使用`mapState`和`mapMutations`分别对`state`和`mutation`进行直接映射，映射之后，我们在读取`state`中的数据，和使用`mutations`中的方法时，写法上就和使用`data`中的数据、和`methods`中的方法一样。
* component.vue
  ```js
  // 结构赋值，引入两种映射关系
  import {mapState,mapMutations,mapGetters,mapActions} from './store';
  export default{
      //......vue ohters options
      //使用拓展运算符
      computed:{
          ...mapState(["count"]),
          ...mapGetters(["count"])
      }
      methods:{
          ...mapMutations(["add","reduce"]),
          ...mapActions(["addAction","reduceAction"])
          }
      store
  }
  ```
### 提交变化
* 使用`commit`来调用`mutation`中的方法，而触发`state`中数据的改变
```html
<template>
 <button @click="commit('add')">增加</button>
  <button @click="commit('reduce')">增加</button>
 </template>
```
* BTW~在使用`mapState`和`mapMutations`映射之前，$store对象是挂载在Vue对象上的，而所有的状态和方法都是挂载在$store上的，使用方法如下
```html
<template>
 <button @click="$store.commit('add')">增加</button>
  <button @click="$store.commit('reduce')">增加</button>
  <span>{{$.state.count}}</span>
 </template>
```
### 小总结

* `state` 数据仓库，类似于Vue实例中的`data`属性

* `mutations` 用于操作`state`中的数据

* `getters` 相当于`vuex`中的`computed`属性，常用于对`state`中的数据的修饰

* `actions` 实现`mutation`中方法的异步操作，一般用于整理包裹`mutations`中的方法，然后再组件中调用`action`中的方法
   
* `modules` 用于统一管理以上四项的模块功能，大型项目一般会进行使用，用于统筹以上四项。针对不同的模块，应该会有多个不同的`modules`
