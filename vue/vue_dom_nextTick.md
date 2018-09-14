## Vue内部DOM更新机制
我们都知道Vue的DOM更新机制基本为：`setter`  :arrow_right:  `Dep` :arrow_right:  `Watcher` :arrow_right: `patch`   :arrow_right: `视图更新`

 :question: 那么要是我们在一个生命周期内，改变某个数据`1000`次，那么DOM是会被刷新`1000`次吗？
 
 :x:答案是否定的，这个和本文的主体`nextTick`有一定关系。
 #### watcher 的收集和去重机制
 `setter`  :arrow_right:  `Dep` :arrow_right:  `Watcher` :arrow_right:`Watcher.update` :arrow_right:`queueWatcher` :arrow_right: `flushSchedulerQueue`  :arrow_right:   `watcher.run()`:arrow_right:  `patch`   :arrow_right:`视图更新`
 ###### 准备工作
 * 首先维护一个`schedulerQueue`
* 我们给每个`watcher`对象都标记上`id`，以辨别出相同的`watcher`。
###### Watcher.update 与 queueWatcher
* 每一个`tick`中的每一次数据变化，都会触发`watcher`对象的`update`方法，这里的`update`方法并不直接对应更新DOM的操作，而用`queueWatcher`去判断自身`wacther`是否已经被`queue`收集过了，若没有被收集则将自身加入`schedulerQueue`。
```js
let has = {};
let queue = [];
let waiting = false;

function queueWatcher(watcher) {
    const id = watcher.id;
    if (has[id] == null) {
        has[id] = true;
        queue.push(watcher);
                if (!waiting) {
            waiting = true;
            nextTick(flushSchedulerQueue);
        }
    }
}
```
###### flushSchedulerQueue 与 watcher.run()
* 取出去重后的 `schedulerQueue`
* `flushSchedulerQueue` 方法执行，循环执行数组中每个`watcher`对象上的`run`方法真正去刷新视图。

就像是，在银行排队改密码顺便再取个`1000`块钱，你想把密码改为改为`123456`,正在排队还没轮到你。
突然你老婆要求你不能设置那么简单，决定改为`930101`吧，这时候你明显不需要重新另排一个队，或者让你老婆另外再排一个队，而是你听完电话通知之后，一次性把密码改为`930101`就好了。
___
### 小实验
根据上面的知识点去想想,`DOM`被更新了几次？
```html
<template>
  <div id="app">
    <img src="./assets/logo.png">
    <h1>{{ msg }}</h1>
    <h2>val 当前值为 {{val}} </h2>
    <h3> val 被 vue 修改了 {{count }} 次</h3>
  </div>
</template>
```
```js
export default {
  name: 'app',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      val: 0,
      count: 0,
    }
  },
  mounted() {
    this.val = 333;
    this.$nextTick(_ => {
      this.val = 444;
    })
    this.$nextTick(_ => {
      this.val = 555;
    })
    setTimeout(() => {
      for (let i = 2000; i < 3000; i++) {
        this.val = i;
      }
    }, 3000)
  },
  watch: {
    val(newVal, oldVal) {
      this.count += 1;
      console.log("val  is changed")
    }
  }
}
```
##### 结果过程
![](/blog_assets/NEXT_TICK.gif)
___
### 小实验②
若把上一个实验的`script`部分改为如下内容，猜猜结果是如何呢？
```js
export default {
  name: 'app',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      val: 0,
      count: 0,
    }
  },
  beforeMount() {
    console.log(111)
    this.val = 111;
    this.$nextTick(_ => {
      console.log(222)
      this.val = 222;
    })
  },
  mounted() {
    console.log(333)
    this.val = 333;
    this.$nextTick(_ => {
      console.log(444)
      this.val = 444;
    })
    this.$nextTick(_ => {
      console.log(555)
      this.val = 555;
    })
    setTimeout(() => {
      for (let i = 2000; i < 3000; i++) {
        this.val = i;
      }
    }, 3000)
  },
  watch: {
    val(newVal, oldVal) {
      this.count += 1;
      console.log("val  is changed")
    }
  }
}
```
###### 输出结果 
![](/BLOG_ASSETS/vue_nextTick_demo2.png)

说明同步修改不分生命周期，都会在第一个`eventLoop`中进行，而`$nextTick`也不区分生命周期，都会在本轮执行栈的`微任务阶段`完成修改。
