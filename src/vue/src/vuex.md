# Vuex回顾
### vuex是啥
* vuex是一个前端的数据仓库，可以类比与`cookie`、`sessionStorage`、`localtionStorage`
### 来一个小demo
* store.js
```js
import vue from 'vue';
import vuex from 'src/vue/src/vuex';
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
### 源码解析       
vuex是vue的一个插件，我们在使用的时候用的是`Vue.use(vuex)`，以前了解过Vue源码的同许都知道，vue的插件机制是通过`install`方法进行导入的，所以vuex也是实现了一个install方法     
```js
export function install (_Vue) {
  if (Vue && _Vue === Vue) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      )
    }
    return
  }
  Vue = _Vue  
  // 前面的操作基本可以不看，重点就在这里，applyMixin    
  applyMixin(Vue)
}
```      
applyMixin这个方法在另一个目录`src/mixin.js`下     
```js
// 这里export 出来的function 就是 上面提到的 applyMixin
export default function (Vue) {
  const version = Number(Vue.version.split('.')[0])
  if (version >= 2) {
    // 对啦，重点就只有这一句，混入了一个 beforeCreate的钩子函数。         
    Vue.mixin({ beforeCreate: vuexInit })   
  } else {
   // 内容省略...这里为处理 1.x版本的代码，重点请关注上面 👆   
  }

  // 在 beforeCreate的过程中实现以下操作。 
  function vuexInit () {
    const options = this.$options
    // 给每一个组件都注入 $store 属性     
    if (options.store) {   
      //  若没有 store属性，则创建一个
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store
        // 若有的话，则判断是否有父节点，若叶有父节点，则会读取父节点的$store给当前节点          
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store
    }
  }
} 
```       
##### 创建 Vuex对象   
我们在工作中使用vuex是这样紫的，给Vue构造器函数传入actions,getters,state,mutations,modules等配置参数。            
```js
export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  modules
  // ...
})
```
我们来看看模块module系统的源码是怎么样的？ 
```js
// 
export default class Module {
  constructor (rawModule, runtime) {
    this.runtime = runtime
    // children 用于保存子模块
    this._children = Object.create(null)
    // _rawModule用于保存用户传进来的这个直接的模块        
    this._rawModule = rawModule         
    // _rawState 用于保存用户传入的module第一层对应的 state对象     
    const rawState = rawModule.state

    // Store the origin module's state
    this.state = (typeof rawState === 'function' ? rawState() : rawState) || {}
  }


// 接下来是一些 工具方法   
  get namespaced () {
    return !!this._rawModule.namespaced
  }

  addChild (key, module) {
    this._children[key] = module
  }

  removeChild (key) {
    delete this._children[key]
  }

  getChild (key) {
    return this._children[key]
  }
  // 更新内部的 actions  mutations 与 getters      
  update (rawModule) {
    this._rawModule.namespaced = rawModule.namespaced
    if (rawModule.actions) {
      this._rawModule.actions = rawModule.actions
    }
    if (rawModule.mutations) {
      this._rawModule.mutations = rawModule.mutations
    }
    if (rawModule.getters) {
      this._rawModule.getters = rawModule.getters
    }
  }

  forEachChild (fn) {
    forEachValue(this._children, fn)
  }

  forEachGetter (fn) {
    if (this._rawModule.getters) {
      forEachValue(this._rawModule.getters, fn)
    }
  }

  forEachAction (fn) {
    if (this._rawModule.actions) {
      forEachValue(this._rawModule.actions, fn)
    }
  }

  forEachMutation (fn) {
    if (this._rawModule.mutations) {
      forEachValue(this._rawModule.mutations, fn)
    }
  }
}

```





### 小总结

* `state` 数据仓库，类似于Vue实例中的`data`属性

* `mutations` 用于操作`state`中的数据

* `getters` 相当于`vuex`中的`computed`属性，常用于对`state`中的数据的修饰

* `actions` 实现`mutation`中方法的异步操作，一般用于整理包裹`mutations`中的方法，然后再组件中调用`action`中的方法
   
* `modules` 用于统一管理以上四项的模块功能，大型项目一般会进行使用，用于统筹以上四项。针对不同的模块，应该会有多个不同的`modules`
