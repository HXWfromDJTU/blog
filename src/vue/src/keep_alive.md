# keep-alive 机制 


keep-alive 也是一个对象，当在使用的时候，他在Vue组件中的父子关系会被忽略掉。     

使用this.cache 和 this.keys，本质上市区缓存已经创建过的v-node。       

使用`max`配置项去限制缓存的大小。

使用 render 机制，而不是template

