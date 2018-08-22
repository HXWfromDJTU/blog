# Vue 实践项目问题收集

### method 与 computed
> 例如在v-for的指令中，需要给数组中的所有值格式化后，再传递/使用
* computed 选项中的方法不可以传参
* 遇到以上情况时候，推荐使用method去实现，返回值根据不同的传参item而不同。