# Vue组建数据流
前言
> 提到Vue组件数据流，不得不提Vue 1.0 升级到Vue 2.0之后的变动，取消了 props的数据双向绑定。为的是避免子组件修改内部数据时，也污染到的外部父组件的数据。



以下是工作中遇到的几个常见的需求场景

* 场景一：单向数据使用 prop的方式进行传值，子组件直接使用 prop 传入的值
  > 实际场景：普通的单项数据流，子组件不对接受的参数进行修改，仅限于调用，但不做修改
* 场景二：双向数据，父子组件需要双向绑定的数据，其中一方变动，需要双方一起变动
   > 实际场景：常用的dialog(或者成为modal)的显示与隐藏
   实现方法：
   * ①使用`sync`+`update:propName` 的方式实现双向绑定,(Vue版本大于2.30)文档[摸我](https://cn.vuejs.org/v2/guide/components.html#sync-%E4%BF%AE%E9%A5%B0%E7%AC%A6)
  
   ```html
     <!-- 父组件 parent.vue -->
      <template>
        <!-- 关键点① sync -->
         <child :visible.sync="childCom.visible"></child> 
           </template>
        <script>
          export default{
            data(){
              return {
                childCom:{
                  visible
                }
              }
            }
          }
          </script>
 
         <!-- 子组件 child.vue -->
         <template>
       <template>
           <div class="childComponent" v-show="innerVisible"></div>
        </template>
        <script>
          export default{
            props:["visible"]
            data(){
              return {
              innerVisible:false
              }
            },
            watch:{
              visible(newVal){
                this.innerVisible = newVal;
              },
              innerVisible(){
                if(newVal==false){
                  this.emit("update:visible",newVal);  //关键点②
                }
              }
            }
          }
          </script>
   ```
   *②使用自定义组件的 `v-model`属性（Vue版本大于2.20,文档[摸我](https://cn.vuejs.org/v2/guide/components.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BB%84%E4%BB%B6%E7%9A%84-v-model)
   父组件中 ：
   ```html
   <template>
       <child   v-model="visible"></child>
   </template>
   <script>
     export default{
       data(){
         return{
            visible:false
         }
       }
     }
     </script>
   ```
   ```html
   <template>
             <div class="childComponent" v-show="myVisible"></div>
     </template>
     <script>
export default{
  model:{
    prop:"myVisible",
    event:"change"
  },
  props:{
    myVisible:Boolean //仍需要显示地去声明传入的值，并且与model的prop值对应
  }
}
</script>
   ```
    采用以上两种方式，开启双向绑定，可以省去子组件内部改变后，父组件则可以不用手动监听事件，然后再进行外部修改
* 场景三： 一个数据内部要修改，外部也要修改
     区别点但是外部的操作并不受内部值得影相，或者说外部传值的时候，并不关心内部的值处于一个什么状态。
> 实际场景 : 组件A给组件B传递dataList用于显示，而组件B内部可以对外部传入的dataList，选择是否进行处理后再显示)
   * 在组件内的`data` 选项中，声明这一个变量
   * 在`prop`提供一个对应的参数，让父组件可以进行传值
   * 在`watch`选项中，对`prop`里设置的值进行监测，监测到变动，将传入值赋值到`data`的值上
   * 内部需要操作的时候，直接对`data`选项中的值进行操作，不要对`prop`的值进行操作


最后，要是还是不明白的话，我们至少要坚持几条原则：
 * 在子组件中，绝不直接修改`prop`传入的值。
 有些小伙伴发现，在子组件中更直接修改`prop`传入的值有时候会有`FBI Warning`~oh 不，是`Vue Warning`，有时候不会(当prop值是Object和Array时不会)，但是总体来说这样的做法都是不正确的。会让父子组件的数据流变得何难理解。