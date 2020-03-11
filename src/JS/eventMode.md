# Javascript DOM事件模型

Javascript的事件模型，主要基于观察者模型来形成，支持页面行为（JS代码）与页面外观的(HTML和CSS)之间的松散耦合。

DOM2是一个比较成熟的统一解决方案，`IE9` `FireFox` `Opera` `Safari`和 `Chrome`都已经实现了`DOM2`级事件的核心部分(燃鹅...IE8仍然独断专行...自己搞自己的一套)

理解JS事件模型，需要理解几个主要的概念
___
### 事件流
事件流的诞生，IE和Netscape开发团队在同心圆点击的问题上，提出了差不多相反的事件流模型，`事件冒泡`和`事件捕获`。

### 事件冒泡
IE的事件流叫做事件冒泡`(event bubbling)`，即时间开始由最具体的元素(也就是文档中嵌套层次最深的那个节点)接受，然后逐级向上传播到文档顶端。

通俗的说就是事件`从内层往外层传播`依次触发。

### 事件捕获
另一种事件流我们称之为，事件捕获`(event capturing)`。事件的思想是不太具体的节点（外层节点）首先接收到事件，而最具体的节点应该最后接收到事件。

虽然DOM2级事件规范要求事件应该从document作为顶部元素开始传播，但是实际上浏览器都是从`window`对象开始捕获事件的。

###### 优先使用事件冒泡
由于许多老版本的浏览器不支持事件捕获，所以建议读者放心地使用时间冒泡，在有特殊需求的时候再去使用事件捕获。



### 综合理解
虽然`DOM2`级规范中明确要求，事件捕获阶段不会涉及事件目标。
但是大多数支持`DOM`事件流的浏览器都实现了一种特定行为，也就是在事件的捕获阶段会在目标元素上触发事件。
这样一来，一次操作就会出现两个机会在目标对象上面的操作事件。
___
## 事件的处理
### 在DOM中处理事件 <span style="color:green;font-size:14px">(尽量摈弃)</span>
指的是在HTML代码中直接使用行内的方式，书写回调事件。这样有几个缺点。    
1️⃣ 存在时间差，当DOM加载成功，但是DOM中加载的事件处理程序(JS代码)未加载，则会出现找不到处理方法的错误。   
2️⃣ 在DOM中写处理代码，会涉及到很多分割标志符的问题，单引号双引号，还会涉及转义字符，在不同浏览器中可能解析的意义不一样。    
3️⃣ 在需求变更的时候，DOM和JS处理代码耦合性过强。  

### DOM0 级别的处理程序<span style="color:green;font-size:14px">(兼容性最好)</span>
##### 获取元素   
使用`DOM对象`进行绑定。这种绑定方式，会在事件的`冒泡阶段被触发`。
```js
let btn = document.getElementById('button');
btn.onclick = function(){
    console.log(this.id)
}
```
##### 移除
将元素绑定的处理事件指向`null`
```js
btn.onclick = null;
```

### DOM2 级别的处理程序
##### DOM2一般事件处理
```js
elementObj.addEventListener(event,handle,useCpature)
```
   * `elementObj`：DO对象。
   * `eventName`：事件名称
   * `handle`：事件句柄函数
   * `useCapture`：Boolean类型，表示是否使用事件捕获，默认为`false`。  

![](/blog_assets/DOM2.png)
<div style="color:grey;text-align:center;">红宝书原文</div>

##### IE事件处理
```js
elementObj.attachEvent(eventName,handle);
```
   * `elementObj`：DO对象。
   * `eventName`：事件名称
   * `handle`：事件句柄函数 

![](/blog_assets/IE_ATTACH.png)  

<div style="color:grey;text-align:center;">红宝书原文</div> 
 
##### 注意
1️⃣  `attachEvent`低版本浏览器中也能够兼容，但`addEventListener`方法需要在`IE 9`及其以上浏览器才能够生效。  

2️⃣ 并且在 `attachEvent`的回调函数中，`this`指向的是`window`对象，因为处理程序会在全局作用域中运行...   

3️⃣ 虽然DOM2要求事件的捕获要从`docuemnt`对象开始，但是主流的所有浏览器只要支持DOM2的，都是从`window`对象开始捕获的。     

4️⃣ 有一个抽象的概念，叫做`处于目标阶段`，这个阶段概念上是包含在事件的冒泡阶段中的。   


##### removeEventListener 
1️⃣ 移除事件的时候，必须传入和绑定的时候一样的参数才能够实现移除。   
2️⃣ 通过addEventListener是无法实现事件监听的覆盖，只能够使用removeEventLsitener来移除监听。   


___ 

### event对象
##### 属性  （全都是只读属性）
`bubble`           表明事件是否冒泡
`cancelable`      表明是否可以取消事件的默认行为
`currentTarget`  其事件处理程序当前正在处理的那个元素（根据捕获和冒泡阶段不断变化）
`target`  事件的目标（唯一固定）
`defaultPrevented`  为true表示已经调用了preventDefault() 
`detail`     与事件相关的一些细节信息   
`eventPahse`   表明时间处理程序的阶段：1 表示捕获阶段，2表示处于目标阶段，3 表示冒泡阶段
`type` 事件被触发的类型
##### 方法
`preventDefaullt()`  
取消事件的默认行为，但前提是，属性`canaelable`为`true`
例如，`type`为`submit`的`button`。

`stopImmediatePropagation()`  <span style="font-weight:bolder;color:red">DOM3 新增</span>
 取消事件的进一步冒泡，同时阻止任何事件的处理程序被调用 

`stopPropagation()`  
取消事件的进一步捕获、目标处理、冒泡，该节点上处理该事件的处理程序将被调用，事件不再被分派到其他节点。   

##### 兼容性写法
```js
// 获得event对象兼容性写法 
event || (event = window.event);

// 获得target兼容型写法 
event.target||event.srcElement

// 阻止浏览器默认行为兼容性写法 
event.preventDefault ? event.preventDefault() : (event.returnValue = false);

// 阻止冒泡写法 
event.stopPropagation ? event.stopPropagation() : (event.cancelBubble = true);
```
___
### DOM3 
`DOM3`级事件在`DOM2`级事件的基础上添加了更多的事件类型，全部类型如下：
##### `UI事件`
当用户与页面上的元素交互时触发，如：load、scroll
##### `焦点事件`
当元素获得或失去焦点时触发，如：blur、focus
##### `鼠标事件`
当用户通过鼠标在页面执行操作时触发如：dbclick、mouseup
##### `滚轮事件`
当使用鼠标滚轮或类似设备时触发，如：mousewheel
##### `文本事件`
当在文档中输入文本时触发，如：textInput 
##### `键盘事件`
当用户通过键盘在页面上执行操作时触发，如：keydown、keypress 
##### `合成事件`
当为IME（输入法编辑器）输入字符时触发，如：compositionstart 
##### `变动事件`
当底层DOM结构发生变化时触发，如：DOMsubtreeModified

___
### 聊聊IE8及兼容性
`IE`及更早的版本只支持事件冒泡，所以通过`attachEvent()`添加的时间处理程序会被添加到冒泡过程。  

___
### 参考文章
[Javascript高级程序设计 - 第三版]()


相关笔记📒：[DOM事件模型](/JS/eventBubble.md)
