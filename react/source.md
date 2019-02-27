
# react源码解析课程  

### 第一节 

UI = fn(x)   api简单   setState  纯粹  

react 16 完全更新了   fiber内核   

hooks  


整体基于画图   

fiber sheduler   

需要进行反复的思考

### 源码解析  

react-dom 

react-reconciler   

sheduler 16之后的十分核心的包，实现异步渲染的功能。 

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
[react - babel 实时转换](https://babeljs.io/repl#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=DwEwlgbgfMD07SA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=false&presets=react%2Cstage-2&prettier=false&targets=&version=7.3.4)   


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

### 第八节 Context   
实际场景：父子嵌套多层，多个层次的组件间的沟通。         
上级组件提供了一个context属性，传入一个对象，只要是在这个组件树中的组件，都可以使用`context`属性对其进行访问。
1️⃣ childContentType   

2️⃣ createContext     