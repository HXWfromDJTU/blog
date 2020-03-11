# elementUI源码解读之el-scrollbar
> 使用elementUI项目改版深入，发现页面内的多个模块都需要展示很多内容
这时候，页面内粗线了多个`又大又粗`的滚动条:expressionless:

>正在寻找Vue下管理滚动条的解决方案时。
咦？发现了elementUI官网右侧若隐若现的滚动条，下意识地F12了一下，便开始了`el-scrollbar`的发现之旅:smiling_imp:

devtools中的`el-scrollbar`
![图片](../blog_assets/scrollbar_console.png)

源码包中
```file
>scrollbar
 |->src
 |   |-bar.js
 |   |-main.js
 |   |-util.js
 |-index.js
```

既然官网不给文档，那我们自己动手吧

先看最简单的 `index.js`
```javascript
import Scrollbar from './src/main';

/* istanbul ignore next */
Scrollbar.install = function(Vue) {
  Vue.component(Scrollbar.name, Scrollbar);
};

export default Scrollbar;
```
:joy:haha~引入了个scrollbar组件，然后定义install方法使得`Vue.use(Scrollbar)`的时候，得以进行挂载，并把`scrollbar`暴露出去

这里提到了`main.js`，看看去
```javascript
import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event';
import scrollbarWidth from 'element-ui/src/utils/scrollbar-width';
import { toObject } from 'element-ui/src/utils/util';
import Bar from './bar';
```
引入了三个配置，依次是`Resize事件的监听器`，`scrollbar全局配置的宽度`，`toObject工具函数`，和一个子组件`bar`
```js
props: {
    native: Boolean,
    wrapStyle: {},
    wrapClass: {},
    viewClass: {},
    viewStyle: {},
    noresize: Boolean, // 如果 container 尺寸不会发生变化，最好设置它可以优化性能
    tag: {
      type: String,
      default: 'div'
    }
},
```
`wrapStyle`、`wrapClass`、`viewClass`、`viewStyle`....咦？貌似有点眼熟。我们在渲染后的页面中，也发现了`view`和`wrapper`的字眼，tag参数还有个`default:'div'`估计是可以选择包裹层的标签，其他俩猜不到，继续往下看吧

`main.js`的`render(h)`部分
* 这里使用了`render(h)`的方式带代替常见的`template`，详细请参考另一篇[文章](https://cn.vuejs.org/v2/guide/render-function.html)
* 接收了并解析 `wrapStlyle` 传入的样式参数，然后与 系统设定的 `gutterStyle``gutterWidth`融合
 ```js
    let gutter = scrollbarWidth();
    let style = this.wrapStyle;

    if (gutter) {
      const gutterWith = `-${gutter}px`;
      const gutterStyle = `margin-bottom: ${gutterWith}; margin-right: ${gutterWith};`;
      if (Array.isArray(this.wrapStyle)) {
        style = toObject(this.wrapStyle);
        style.marginRight = style.marginBottom = gutterWith;
      } else if (typeof this.wrapStyle === 'string') {
        style += gutterStyle;
      } else {
        style = gutterStyle;
      }
    }
 ```
 * 设定`view层`的各项属性
 ```js
    const view = h(this.tag, {
      class: ['el-scrollbar__view', this.viewClass],
      style: this.viewStyle,
      ref: 'resize'
    }, this.$slots.default);
 ```
  * 设定`wrapper层`的各项属性
 ```js
 const wrap = (
     <div
        ref="wrap" //设置引用名称
        style={ style } //设置上面融合好的wrapper层样式
        onScroll={ this.handleScroll } //绑定 scroll事件
        class={ [this.wrapClass, 'el-scrollbar__wrap', gutter ? '' : 'el-scrollbar__wrap--hidden-default'] }
         //添加用户为 wrapper层设置的class，若是gutter不为0，则添加这个 一堆名字这么长的类，后面再看看
        >
        { [view] } //把view曾内容嵌套进wrapper层内部
      </div>
    );
 ```
 * 诶~`native`参数这里开始用到了，根据是否`native`，设定两种渲染方式
   1、调用`bar`子组件，含有横向和纵向两个滚动`bar`
   2、直接将wrap层作为结果返回
   在最后的一句中，在外层还包裹了一个`el-scrollbar`层
```js
    if (!this.native) {
      nodes = ([
        wrap,
        <Bar
          move={ this.moveX }
          size={ this.sizeWidth }></Bar>,
        <Bar
          vertical
          move={ this.moveY }
          size={ this.sizeHeight }></Bar>
      ]);
    } else {
      nodes = ([
        <div
          ref="wrap"
          class={ [this.wrapClass, 'el-scrollbar__wrap'] }
          style={ style }>
          { [view] }
        </div>
      ]);
    }
    return h('div', { class: 'el-scrollbar' }, nodes);
    // render的回调，h函数三个参数意思分别 为 h（创建的标签名，标签自身的各项属性对象，子组件node数组）
  }
 ```
 `methods`、`mounted`、`beforeDestory`中的代码于滚动条操作有关，我们稍后讨论
`utils.js`
* 先是列举出了bar组件的一些配置， 分别是纵向的和横向的。
```js
export const BAR_MAP = {
  vertical: {
    offset: 'offsetHeight',
    scroll: 'scrollTop',
    scrollSize: 'scrollHeight',
    size: 'height',
    key: 'vertical',
    axis: 'Y',
    client: 'clientY',
    direction: 'top'
  },
  horizontal: {
    offset: 'offsetWidth',
    scroll: 'scrollLeft',
    scrollSize: 'scrollWidth',
    size: 'width',
    key: 'horizontal',
    axis: 'X',
    client: 'clientX',
    direction: 'left'
  }
}

```
