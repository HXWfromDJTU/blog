# DOM事件绑定的几种方式
#### ①直接在DOM元素中绑定，使用 onXXX进行触发

#### ②获取元素对象后，对元素进行事件绑定。
```js
 document.getElemengById('demo').onclick = function(){
     // so something
 }
```
#### ③使用事件监听
① `elementObj.addEventListener(event,handle,useCpature)`
   * `elementObj`：DO对象。
   * `eventName`：事件名称
   * `handle`：事件句柄函数
   * `useCapture`：Boolean类型，表示是否使用事件捕获。

②`elementObj.attachEvent(eventName,handle);`
   * `elementObj`：DO对象。
   * `eventName`：事件名称
   * `handle`：事件句柄函数    
 
注意： `attachEvent`低版本浏览器中也能够兼容，但`addEventListener`方法需要在`IE 9`及其以上浏览器才能够生效。
