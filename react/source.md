
# 前言 

UI = fn(x)   api简单   setState  纯粹  

react 16 完全更新了   fiber内核   

hooks  


整体基于画图   

fiber sheduler   

需要进行反复的思考

react-dom 

react-reconciler   

sheduler 16之后的十分核心的包，实现异步渲染的功能。 
___
# React主体   
主要围绕`./src/React.js`这个文件来说明，React上挂载的常用方法     
### ⭕️ 第一节 react 与 react-dom的关系   
index.js  => React.js（100行都不到）   ReactBaseClass(也是100行不到) 
主要在React-Dom中为主要  
React.js 主要用于向外提供Api
ReactBaseClass 主要去定义React组件的一些东西    

真正的实现，在于web端的React-dom或者是native端的ract-native,所以这两者的内容会更多。     

 >React也是使用了Flow去作为静态语法类型检查工具.....

### ⭕️ 第二节 JSX转化为js之后变成什么样子  
可阅读性和可维护性更强。      

JSX需要进行babel转换      

![](/blog_assets/JSX-TO-JS-1.png)
[react - babel 在线转换体验👉](https://babeljs.io/repl#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=DwEwlgbgfMD07SA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=false&presets=react%2Cstage-2&prettier=false&targets=&version=7.3.4)   


自定义的组件必须要大写字母打头，否则JSX解析的时候就会理解为一个原生标签，找不到的话运行的时候就会报错。      

### ⭕️ 第三节 ReactElement 与 createElement  
初次出现的地方在 `React.js`中被引入，并且挂载到React对象上面。     

`React.js`节选                
```js
//line 21 
import {
  createElement,
  createFactory,
  cloneElement,
  isValidElement,
} from './ReactElement';
```

`ReactElement.js`节选  
```js
// 声明内建 props的key
const RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true,
};
```
```js
/**
 * Create and return a new ReactElement of the given type.
 * See https://reactjs.org/docs/react-api.html#createelement
 */
// type    节点类型  1️⃣ 若是一个字符串，那么表示一个html原生的标签  2️⃣ 若是 一个class component 或者 functional component 那么就表明是一个自定义组件  3️⃣  传入一个React的原生的组件，传入的是一个Symbol Fragment StrictMode  
// config  所有的attr都会以 key-value的形式存入,key 和 ref也会被存入 config中
// children    标签中间的内容(文字)或者是一些子标签
//      
export function createElement(type, config, children) {
  let propName;

  // Reserved names are extracted
  const props = {};

  let key = null;
  let ref = null;
  let self = null;
  let source = null;
  // 判断是否有有效的 ref 值 和 有效的 key值
  if (config != null) {
    // 处理 几个内建的 props (line 16)
    if (hasValidRef(config)) {
      ref = config.ref;
    }
    if (hasValidKey(config)) {
      key = '' + config.key;
    }
    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
    // Remaining properties are added to a new props object
    // 将属性都添加到一个 名为  props 的对象上     
    for (propName in config) {
      if (
        //  过滤掉这几个指定的内建props     
        //  RESERVED_PROPS 中包含 ref  key __self  __source 这四个内建的props key名被占用了 (详见本文件 line 16)    
        hasOwnProperty.call(config, propName) &&
        !RESERVED_PROPS.hasOwnProperty(propName)
      ) {
        props[propName] = config[propName];
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.   
  // 接下来开始处理第三个参数
  // 子节点是可以超过一个的，所有的子节点都会被转移到 props 对象上。
  const childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    // 遍历接收所有的子节点，整合到一个数组中    
    const childArray = Array(childrenLength);
    for (let i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    if (__DEV__) {
      if (Object.freeze) {
        Object.freeze(childArray);
      }
    }
    // 将子节点集合传入赋值还给 props的chindren属性     
    props.children = childArray;
  }

  // Resolve default props 
  // 这里说明 我们在声明组件的时候，是可以在组件上绑定一个静态属性 defaultProps 来作为组件的静态属性。   
  /* class MyComponent extent React.Component{
       return (<div> my component </div>)
  } 
  // 设置默认值
  MyComponent.defaultProps = {
    name:'my-component',
    value:123
  }
  */
  if (type && type.defaultProps) {
    const defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      // 假设调用者没有传入同名的 props属性，那么就使用默认的props，调用者传入了的话就进行覆盖
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }
  if (__DEV__) {
    if (key || ref) {
      const displayName =
        typeof type === 'function'
          ? type.displayName || type.name || 'Unknown'
          : type;
      if (key) {
        defineKeyPropWarningGetter(props, displayName);
      }
      if (ref) {
        defineRefPropWarningGetter(props, displayName);
      }
    }
  }
  // 根据我们处理过的这些参数值，创建一个 ReactElement 对象(line )
  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current,
    props,
  );
}
```
```js
// 这个函数 作用是 使用工厂模式 创建一个 ReactElement 对象
const ReactElement = function (type, key, ref, self, source, owner, props) {
  const element = {
    // This tag allows us to uniquely identify this as a React Element
    // 标志着 ReactElement 的类型永远都是一个 ReactElementType，这个属性后期会被用于进行一个判断，用与优化更新过程。      
    $$typeof: REACT_ELEMENT_TYPE,

    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,

    // Record the component responsible for creating this element.
    _owner: owner,
  };

  // ... 其他内容暂时省略

  return element;
};

```  

### ⭕️ 第四节 pureComponent 与 Component    
 

`React.js`节选
```js
// line 18 
import { Component, PureComponent } from './ReactBaseClasses'; 

// line 51
const React = {
  Children: {map,forEach,count,toArray,only},
  createRef,
  //此处我们到将 Component 与 PureComponent 进行了一个挂载
  Component,
  PureComponent,
   // ... 其他属性
}
```

`ReactBaseClasses.js`节选    
这一步分源码，我们能看到，Component类初始化的时候，并没有像Vue源码那样初始化一大堆的生命周期啊，参数啊，data啊的东西，就是一个简简单单的 props 和 refs。 

并且 updater 更新器也是由其他部分的插件自由拼装进来的。像 React-DOM 调用的时候肯定就传入一些更新DOM的操作，若是Native环境，React-Native 就会传入一些更新 Native组件的方法。       
```js
/**
 * Base class helpers for the updating state of a component.
 */
// 接收 props 、上下文 和 更新器 三个作为参数
function Component(props, context, updater) {
  // FIXME: 常用的属性()     
  this.props = props;
  this.context = context;
  // If a component has string refs, we will assign a different object later.
  // 临时创建一个空对象给 refs属性，若是调用者给 这个组件设置了 refs名称，则后续会被改写这个值。     
  this.refs = emptyObject;
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  // 更新器 React.js本身不作提供，而是由 React-DOM 或者 React-Native 进行具体实现   
  this.updater = updater || ReactNoopUpdateQueue;
}
// 在原型上绑定一个属性叫做 isReactComponent  
Component.prototype.isReactComponent = {};
```
```js
// 最常用的 更新状态的api ，第二个参数是state更新后的一个callback
Component.prototype.setState = function (partialState, callback) {
  // 复杂的判断，用于判断参数的合法性
  invariant(
    typeof partialState === 'object' ||
    typeof partialState === 'function' ||
    partialState == null,
    'setState(...): takes an object of state variables to update or a ' +
    'function which returns an object of state variables.',
  );
  // 在底层 setState 是 用 enqueueSetState 实现的
  // 但是要注意，这个方法是 react-dom 和 react-native去实现的 
  // 因为更新的工作在不同平台肯定是有不同实现的
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};
```
```js
// PureComponent 部分
/**
 * Convenience component with default shallow equality check for sCU.
 */
// 基本就是 和 Component是一样的一个类，
function PureComponent(props, context, updater) {
  this.props = props;
  this.context = context;
  // If a component has string refs, we will assign a different object later.
  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}
// 这里声明了一个新的类，叫做 pureComponentPrototype，并且继承自 PureComponent   
// 并且在这个类的原型上挂载了一个公共属性，isPureReactComponent
const pureComponentPrototype = (PureComponent.prototype = new ComponentDummy());
pureComponentPrototype.constructor = PureComponent;
// Avoid an extra prototype jump for these methods.
Object.assign(pureComponentPrototype, Component.prototype);
pureComponentPrototype.isPureReactComponent = true;
```  

### ⭕️ 第五节 createRef 和 ref 
使用ref的三种方法     
1️⃣ 字符串ref  (参考上文第三节的 this.refs = refs )   
```jsx 
export default class MyComponent extends ReactComponent{
   return (
       <p ref="myRef">
   )
}
```   
2️⃣ functional ref 
```jsx
<p ref={ele => {this.methodRef = ele}}></span>
// ele 对应的是这个 DOM/组件 的实例 FIXME: (未知作用)  
```  

3️⃣ 使用 React.createRef()       
```jsx   
export default class MyComponent extends React.Component{
    constructor(props){
        super(props);
        this.objRef = React.createRef();
    }
}
<p ref={this.objRef}>  

// 访问的时候使用 current属性，获得当前的这个组件
this.objRef.current 
```  
来源自 `ReactCreateRef.js`
```js
// an immutable object with a single mutable value
export function createRef(): RefObject {
  const refObject = {
    current: null,
  };
  if (__DEV__) {
    Object.seal(refObject);
  }
  return refObject;
}
```
也在 `React.js`中挂载到React对象上      
```js
// line 19
import { createRef } from './ReactCreateRef';
// line 60
const React = {
  Children: { map, forEach, count,toArray,only,},
  createRef
  // 其他属性......
}
```

❓❓❓ref如何在实战中使用呢？与Vue中的ref又有什么不同呢？ TODO:   

___
### ⭕️ 第六节 forwardRef    
首先，我们补充一个概念，直接返回的组件是一个`pureComponent`
```jsx
// 纯React组件     
const Comp = props=>(input type="text");
```
官网对 `forwordRef`的描述
>React.forwardRef accepts a rendering function as an argument. React will call this function with props and ref as two arguments. This function should return a React node.
React.fordRef 接收一个渲染函数作为参数，React将会调用这个函数，并且传入两个参数，props和ref,这个方法需要返回一个React 节点。    

这个方法不怎么常用，但是在以下两个场景中特别有用  FIXME:拓展其用法   
1️⃣ 将 refs 属性 注入到 DOM Components 中     
2️⃣ 传递 refs 属性到 更高顺次的组件中      
```jsx
const MyComponent = React.forwardRef((props,ref)=>(
    <input type="text" ref={ref}>
))  

// demo 1
export default class Comp extends Component{
    constructor(){
        super();
        this.ref = React.createRef();
    }
    componentDidMount(){
         this.ref.currentvalue = 'ref get input';
    }
    rednder(){
        return <MyComponent ref={this.ref} />
    }
}
```
`./src/forwardRef.js`
```jsx
import { REACT_FORWARD_REF_TYPE, REACT_MEMO_TYPE } from 'shared/ReactSymbols';

export default function forwardRef<Props, ElementType: React$ElementType>(
  render: (props: Props, ref: React$Ref<ElementType>) => React$Node,
) {
  // dev 调试代码......

  // 最后返回的是一个对象
  return {
    // 使用 forwordRef创建出来的组件的 $$typeof 仍然是  REACT_ELEMENT_TYPE 
    $$typeof: REACT_FORWARD_REF_TYPE,
    // render 参数是传入的那个 functional component ,用于真正去渲染出内容的          
    render,
  };
}
```
需要注意的是，这里返回的 `$$typeof` 并不会复写一个ReactELemnt组件的 `$$typeof`属性,forwardRef返回的一个是一个对象，传入给到demo1中的`render()`方法时(其实就是交给了ReactElement)，这里返回的整体是作为ReactElement对象的第一个参数`type`传入的。      
```js
// 这个函数 作用是 使用工厂模式 创建一个 ReactElement 对象
const ReactElement = function (type, key, ref, self, source, owner, props) {
  const element = {
    $$typeof: REACT_ELEMENT_TYPE,
    type: type,
    key: key,
    ref: ref,
    props: props,
    _owner: owner,
  };
  // 其他代码省略......
}
```
此时，我们作为一个ReactElement组件，它的$$typeof属性永远都是`REACT_ELEMENT_TYPE`。     

___

### 第八节 Context  与 getChildContext     
实际场景：父子嵌套多层，多个层次的组件间的沟通。         
上级组件提供了一个context属性，传入一个对象，只要是在这个组件树中的组件，都可以使用`context`属性对其进行访问。React官方提供了两个方法`childContentType`（17版本中即将被废弃） 与`createContext`（新增）   
[官方文档👉](https://react.docschina.org/docs/legacy-context.html#%E6%9B%B4%E6%96%B0context)   

首先，我们来件要地回顾一下如何使用  `getChilContext`   
```jsx  
const PropTypes = require('prop-types'); // 这里需要引入一个React的公共常量库
// 父组件
class FatherComp extends React.Component{
    // 显示地声明要暴露给整个组件数树的参数(属性)
    getChildContext(){
        return {color:'red'}
    }
    render(){
        const children = this.props.messages.map(msg=>{
            <Msg text={msg.text} />
        })
        render(
            <div>{children}</div>
        )
    }
}
// 想要给整个组件树种的子组件都暴露一些属性和参数，就系需要设置这个contextTypes 
FatherComp.contextTypes = {
    color:PropTypes.string
}
// 子组件
class Message extends React.Component{
    render(){
        rteurn(
            <div>
               <MyButton>{this.props.text}<MyButton>
            </div>
        )
    }
}
// 孙组件
class MyButton extends React.Component{
    render(){
         // 注意：小写字母打头表明是html原生的标签(组件)
        return(
            // 这里使用 的 this.context.color 访问到的是父组件中，暴露给子组件的属性      
            <button style={{background:this.context.color }}>   
               {this.props.children}
            </button>
        )
    }
}
// 在使用父组件传递过来的公共参数(属性)的时候，必须要设定这个 contextTypes否则出错  
// 这里有点像是 Vue 的 props的规定参数类型，但是这里若不设置，子组件则完全无法接收到这个参数。        
Mybutton.contextTypes = {
    color:PropTypes.string
}
```
  FIXME: 补充 React.createContext 的使用用法与 源码内容          
___

###  第九节  ConcurrentMode  
基于Javascript是一个单线程的模式，那么渲染任务、一些动画任务、用户输入等等就都是相互互斥的，那么React16后就提出了一个Concurrent来实现许多的react任务优先调度。React内核会判断各种任务的优先级，限制性重要的，然后再执优先基低的任务。     

##### flashSync   
flushSync的作用就是基于上面👆说到的场景，作用是提升异步任务的优先级。
```jsx
import React,{ConcurrentMode} from 'React';
import {flushSync}  from 'react-dom';

class Parent extends React.Component {
    // 使用 flushSync 来提升传入任务的优先级        
    flushSync(_=>{
        this.setState({
            number:123
        })
        console.log('做一些优先级比价高的事情')
    })
}
```  

##### concurrentMode源码 
`ReactSymbols.js`    
```js
// line 12
const hasSymbol = typeof Symbol === 'function' && Symbol.for;
// line 38 
export const REACT_CONCURRENT_MODE_TYPE = hasSymbol
  ? Symbol.for('react.concurrent_mode')
  : 0xeacf;
  // 我们发现，concurrentMode组件就是一个 Symbol对象，没有任何其他的东西
```  

___

### 第十节 Suspense  与 lazy
`Suspend`组件的作用主要的作用是制作出类似于数据加载中的一个效果图。`Suspend`组件中的子组件要求是一个特殊的"异步加载组件"，并且是会抛出一个promise的。suspend会等待子组件中所有的promise状态都决定之后，显示子组件的内容。          
>React.Suspense let you specify the loading indicator in case some components in the tree below it are not yet ready to render.
```jsx 
import React,{Suspense,lazy} from 'React';
function requestData(){
    const promise = file.read();
    throw promise; // 注意，这里一定是要 throw 
}
function SuspendingComp(){
    const data = requestData(); // 获取数据，并且 threw 一个 promise   
    return <p></{data}p>
}
export deafult ()=>{
   <Suspense fallback="数据加载中......">
     <SuspendingComp /> // throw Promise 的一个组件 
   </Suspense>
}

``` 
在 `suspend`  Api 未开放的时候，我们常使用的是 lazy，配合我们的`webpack`实现我们的一个React组件的异步加载过程(优化)。[官网传送门👉](https://react.docschina.org/docs/react-api.html#reactlazy)      
> React.lazy() lets you define a component that is loaded dynamically. This helps reduce the bundle size to delay loading components that aren’t used during the initial render.  
React.lazy使得我们可以定义一个动态加载的组件，这有助于我们减少bundle的大小，在首次首次渲染的时候可以延迟这部分内容的加载。

接下来，简单演示一下使用的实例
```jsx
// 异步加载的组件 lazy.js
import React from 'React';
exportdefault ()=> <p> Lazy Component 这是一个想要被懒加载的组件</p>

// 使用 
import React,{lazy} from 'React'; // 这里引入一个 lazy 方法
const LazyComp = lazy(()=>import('./lazy.js')); // 这里利用webpack的特性

export  deafult ()=>{
   <Suspense fallback="数据加载中......">
     <LazyComp /> // 一个lazy方法处理过的组件
   </Suspense>
}
```
接下来我们看看这两个api的源码实现。  
`React.js` 节选
```js
// line 9
import {REACT_SUSPENSE_TYPE,} from 'shared/ReactSymbols'; // 引入这部分  
// line 28
import { lazy } from './ReactLazy';
// 绑定在React对象上
// line 83 
Suspense: REACT_SUSPENSE_TYPE,  
// line 67
lazy,
```
`ReactSymbols.js`
```js
// line 44 
// 这里我们发现Suspense 还是一个Symbol对象 FIXME: 为啥呢？如何工作呢
export const REACT_SUSPENSE_TYPE = hasSymbol
  ? Symbol.for('react.suspense')
  : 0xead1;
```
`./src/ReactLazy.js` 节选
```js
// 第一个参数是一个 function,并且要求返回的是一个 thenable 的方法
export function lazy<T, R>(ctor: () => Thenable<T, R>): LazyComponent<T> {
  let lazyType = {
    $$typeof: REACT_LAZY_TYPE,
    _ctor: ctor, // 传入的返回Promise的方法
    // React uses these fields to store the result.
    _status: -1, // 用于 记录 这个组件的状态，一般来说对应这个 Promise的状态，这里使用数字的代替
    _result: null, // 异步加载出来的内容（一般是一个组件），加载成功之后，会放到这个属性上     
  };

  // dev调试部分的代码 省略......

  // 最后返回一个组合对象
  return lazyType;
}
```
>Today, lazy loading components is the only use case supported by <React.Suspense>:
时至今日，这个Suspense的使用也只仅仅在lazy的时候才有用

关于这部分内容的实战使用，请参考[官网说明 - Code-Splitting👉](https://react.docschina.org/docs/code-splitting.html#reactlazy)              

TODO:这里最后再留下一个疑问，为何我们需要throw一个promise，而不是我们常常使用的return呢？  


___
# React渲染过程
ReactDom || hydrate     
创建ReactRoot    
创建FiberRoot和RootFiber     
创建更新      
进入调度      
___
### 第一节   ReactDom.render()

首先我们来看看，我们最常见的SPA入口
```jsx
import React from 'raect';
import ReactDom from 'react-dom';
import App from './app'
ReactDOM.render(<APP />,documentgetElementById('root'))
```  
我们去看看react-dom的主入口是个什么情况，如何挂载的render方法,这里我们看到的是客户端渲染的东西     
`./react-dom/src/client/ReactDOM.js`节选
```js
// LINE 672

const ReactDOM: Object = {
  //  暂时省略其他方法...... findDOMNode 与 hydrate等
  // ReactDom.render方法
  render(
    element: React$Element<any>, // 挂载内容
    container: DOMContainer,  // 挂载点
    callback: ?Function,   // 应用渲染结束之后，会调用这个callback
  ) {
    //  判断挂载点是否有效的DOM节点
    invariant(isValidContainer(container),'Target container is not a DOM element.');

    // 省略部分dev调试的代码......   

    // 委托这个方法去实现     
    return legacyRenderSubtreeIntoContainer(
      null,
      element,
      container,
      false,
      callback,
    );
  }
```
接下来看看 legacyRenderSubtreeIntoContainer 方法
```js
// render方法依托此方法实现
function legacyRenderSubtreeIntoContainer(
  parentComponent: ?React$Component<any, any>, // 父组件
  children: ReactNodeList,
  container: DOMContainer,
  // forceHydrate 表示是否会调合 原来存在于 Container组件中的html的节点，是否要复用这些节点
  // 在render方法中传入的是一个 固定的false值,表示不复用节点
  // 在hydrate方法的时候，传入的是true值 
  // (主要在 server-side-render的时候使用，因为第一次渲染SSR和client-render出来的内容一般会是一样的，所以用于复用这些节点)
  forceHydrate: boolean, 
  callback: ?Function,
) {
  // dev调试代码.......省略
  // 一般的组件没有  “_reactRootContainer” 属性，所以我们主要关注 !root中的代码
  let root: Root = (container._reactRootContainer: any);
  if (!root) {
    // Initial mount 初始化挂载
    // 继续依托这个 legacyCreateRootFromDOMContainer 方法实现
    // 根据后续代码知道，这里得到的是一个FiberRoot对象      
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
      container,
      forceHydrate, // （是否缓存container里面的内容）基本可以表示是客户端渲染的意思
    );
    // 判断是否有 callback (这部分和主流程没有太大关系，暂时跳过 TODO:)
    if (typeof callback === 'function') {
      const originalCallback = callback;
      callback = function () {
        const instance = getPublicRootInstance(root._internalRoot);
        originalCallback.call(instance);
      };
    }
    // Initial mount should not be batched.
    // 这里执行了一个 React中的一个batchUpdate 批量更新 ，后续会被说明 TODO:      
    unbatchedUpdates(() => {
        // 这里的判断，“legacyRenderSubtreeIntoContainer(本方法)” 
        // 被 render 和 hydrate 调用的时候,parentComponent 传进来的都是 null
        // 所以这里不会执行第一个 if 
      if (parentComponent != null) {
        root.legacy_renderSubtreeIntoContainer(
          parentComponent,
          children,
          callback,
        );
      } else {
        // 实际调用的是 render方法
        root.render(children, callback); // 请查看后续说明
      }
    });
  } else {
    if (typeof callback === 'function') {
      const originalCallback = callback;
      callback = function () {
        const instance = getPublicRootInstance(root._internalRoot);
        originalCallback.call(instance);
      };
    }
    // Update
    if (parentComponent != null) {
      root.legacy_renderSubtreeIntoContainer(
        parentComponent,
        children,
        callback,
      );
    } else {
      root.render(children, callback);
    }
  }
  // FIXME: 疑惑？那么这里返回的是什么？       
  return getPublicRootInstance(root._internalRoot);
}
```
继续上面的代码看看 `legacyCreateRootFromDOMContainer`方法
```js
//  ReactDOM.js  LINE 495
function legacyCreateRootFromDOMContainer(
  container: DOMContainer,  // 容器节点    
  forceHydrate: boolean,    // 是否缓存container中的东西       
): Root {
  // 合并手动配置 与 自动判断是否该合并的情况
  const shouldHydrate = forceHydrate || shouldHydrateDueToLegacyHeuristic(container);
  // First clear any existing content.
  // 首先处理的是 “!shouldHydrate”的情况，也就是非服务端渲染(不需要缓存container内部节点的情况)
  if (!shouldHydrate) {
    let warned = false;
    let rootSibling;
    // 遍历container里面的节点，并且一个个移除掉
    while ((rootSibling = container.lastChild)) {
      // dev调试代码......

      // 将container里面的内容都移除掉
      container.removeChild(rootSibling);
    }
  }
   // dev调试代码......
  // Legacy roots are not async by default.
  // root节点不应该是async的 FIXME: 为啥？
  const isConcurrent = false;

  // 根据后续可知，这里返回的是一个 FirberRoot 对象   
  return new ReactRoot(container, isConcurrent, shouldHydrate);
}
```
接着看看 `new ReactRoot`
```js
//  ReactDOM.js  LINE 21
import {createContainer/* 此处省略了其他引入*/} from 'react-reconciler/inline.dom';
//  ReactDOM.js  LINE 365 
function ReactRoot(
  container: DOMContainer,
  isConcurrent: boolean,
  hydrate: boolean,
) {
  // 接续看看这个内容 ， 由后续说明可以知道，这里返回的是一个 FirberRoot 对象  
  const root = createContainer(container, isConcurrent, hydrate);
  // 挂载到了这个 this._internalRoot 属性上     
  this._internalRoot = root;
}
```
此处我们追踪到了`react-reconciler`，这是一个React中非常重要的模块，负责操作跟平台无关的节点的一些调合（Hydrate），也负责任务调度。我们现在简单去看看......                
别忘记我们的临时任务只是找到`createContainer`这个方法的来由......

`react-reconciler/inline.dom.js`
```js
export * from './src/ReactFiberReconciler';
```
`react-reconciler/src/ReactFiberReconciler.js`     
```js
// ReactFiberReconciler.js LINE 275
export function createContainer(
  containerInfo: Container,
  isConcurrent: boolean,
  hydrate: boolean,
): OpaqueRoot {
  // 返回了一个 FiberRoot  暂时不说明.....后续说明 FiberRoot是个什么
  // (看到这里，请往回看上一步的返回)
  return createFiberRoot(containerInfo, isConcurrent, hydrate);
}
```
这里我们再来看看 `root.render()`的执行
```js
// ReactDOM.js   LINE 373 
ReactRoot.prototype.render = function (
  children: ReactNodeList,
  callback: ?() => mixed,
): Work {
  const root = this._internalRoot;
  const work = new ReactWork(); 
  callback = callback === undefined ? null : callback;
  if (__DEV__) {
    warnOnInvalidCallback(callback, 'render');
  }
  if (callback !== null) {
    work.then(callback);
  }
  // 主要看这个方法,跳到 ReactFiberReconciler.js 中继续查看
  updateContainer(children, root, null, work._onCommit);
  return work;
};
``` 
```js
// ReactFiberReconciler.js  LINE 283
export function updateContainer(
  element: ReactNodeList,  // 应用的实际的节点 <App />
  container: OpaqueRoot,   // "初始容器DOM节点"被装饰过后的 FiberRoot 对象     
  parentComponent: ?React$Component<any, any>, // null   
  callback: ?Function,  // 这是一个被 ReactWork 封装过的 开始 render方法传入的第三个参数callback
): ExpirationTime {
  const current = container.current;
  const currentTime = requestCurrentTime();
  // 十分重要的点，expirationTime通过十分复杂的计算，并且这个时间会被用于优先级的任务更新 
  //  后续这个计算过程会说明 TODO:
  const expirationTime = computeExpirationForFiber(currentTime, current);
  
  return updateContainerAtExpirationTime(
    element,
    container,
    parentComponent,
    expirationTime,
    callback,
  );
}
```
```js
// ReactFiberReconciler.js  LINE 162
export function updateContainerAtExpirationTime(
  element: ReactNodeList,
  container: OpaqueRoot,
  parentComponent: ?React$Component<any, any>,
  expirationTime: ExpirationTime,
  callback: ?Function,
) {
  // TODO: If this is a nested container, this won't be the root.
  const current = container.current;

   // 省略调试代码.....

  const context = getContextForSubtree(parentComponent);
  if (container.context === null) {
    container.context = context;
  } else {
    container.pendingContext = context;
  }
  //  
  return scheduleRootUpdate(current, element, expirationTime, callback);
}
```

```js
// ReactFiberReconciler.js 
function scheduleRootUpdate(
  current: Fiber,
  element: ReactNodeList,
  expirationTime: ExpirationTime,
  callback: ?Function,
) {
  // 后续会被 讲解 TODO:
  const update = createUpdate(expirationTime);
  // Caution: React DevTools currently depends on this property
  // being called "element".
  update.payload = {element};

  callback = callback === undefined ? null : callback;
  if (callback !== null) {
    warningWithoutStack(
      typeof callback === 'function',
      'render(...): Expected the last optional `callback` argument to be a ' +
        'function. Instead received: %s.',
      callback,
    );
    update.callback = callback;
  }

  flushPassiveEffects();  
  // 这里的 enqueue 有点像是 Vue在一个生命周期内的更新收集(对一个节点的多次更新会被收集起来)
  enqueueUpdate(current, update);
  // 开启任务调度......   
  // 告诉React，我们这里有改变发生了，让内核去调度这些变化产生的任务，优先做优先级高的任务
  scheduleWork(current, expirationTime);

  return expirationTime;
}
```
##### 本节整理      
`ReactDom.render()`  --> `创建了一个 ReactRoot对象` ---> `创建了一个 FiberRoot 对象`  ---> `自动初始化一个 Fiber对象`。     

计算了一个expirationTime 用于比较任务时间
```js
expirationTime = computeExpirationForFiber
```   
过程总也创建了一个update对象，放到ReactRoot对象上,进入一个更新的过程。   

创建一个更新任务，调度一个更新的任务。     

___
### 第二节 


