# 日常工作问题回收站

#### css
> 表格内，td/th 内容强行单词换行
```css
table.mainTable td.content {
  /* 强行单词换行，必须 */
  word-break: break-all;
}
```

> 146:5   error    Opening curly brace does not appear on the same line as controlling statement  brace-style

>Node.js heap out of memory  nodejs 内存溢出
* [article](https://www.cnblogs.com/liugang-vip/p/6857595.html)

>There are multiple modules with names that only differ in casing.
* 这是引用组件时，路径大小写不对导致的。比如：
* 如果Paginate组件是大写的，那么这样用会错： 
```js
import Paginate from '~/components/paginate.vue';
需要这样写：
import Paginate from '~/components/Paginate.vue';
```
* 其他临时解决方案[【摸我】](https://blog.csdn.net/Call_me_small_pure/article/details/79169090)


#### webpack 打包配置，entry的include与exclude
* exclude配置的路径是相对于include而言的
* 

#### elementUI el-input的回车事件
* 文档中看出，elementUI并没有暴露@keyup事件
* 直接写 @keyup.enter 无效
解决办法：
* @keyup.enter.native
* [参考文档](https://cn.vuejs.org/v2/guide/migration.html#%E7%94%A8-v-on-%E7%9B%91%E5%90%AC%E5%8E%9F%E7%94%9F%E4%BA%8B%E4%BB%B6-%E5%8F%98%E6%9B%B4)

#### elementUI el-tree 页面初始化时候，异步拉数据，后需要默认选中第一个值
* 使用promise + then 来解决异步问题


####【node.js】sequelize 插件实现left join的方案
* [参考文档](https://stackoverflow.com/questions/26929911/how-to-do-a-left-join-in-sequelize-with-more-than-one-predicate-in-the-on-clause)

#### 神坑
* 使用浏览器开发时，遇到浏览器询问您是否`更新版本`、`保存密码`、`翻译网页`的弹窗，但由于各种原因并没有显示出来，而阻挡鼠标对元素进行点击。


#### 如何接受奇怪格式的时间，并转换城目标格式
* `moment.js`可以指定输入时间的格式，并且使用`format`输出所需格式
![moment](./blog_assets/moment.png)


#### 行内元素高度不对齐


#### webapck编译内存溢出
> FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed - JavaScript heap out of memory
