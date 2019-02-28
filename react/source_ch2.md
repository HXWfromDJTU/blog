# 第二部分 React渲染过程
关键词： `ReactDom`  `hydrate`  `ReactRoot`    `FiberRoot和RootFiber`   `更新`与`调度`      
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
### 第二节 FiberRoot 对象
FiberRoot是整个应用的起点，记录着整个应用会更新过程的各种信息。      
还记得吗，我们上一节在render方法中船进入的container参数，就会被修饰成一个`FiberRoot对象`
```jsx
ReactDom.render(<App />,document.getElementById('root'),null)
```  
下面👇 的一步步过程其实就是，对 container信息的一个包装，我们可以理解为`Fiber对象`是一个以`挂载点DOM`为核心信息的复杂对象，记录着整个应用的各种信息。        
```js
//ReactDOM.js  LINE 495  legacyCreateRootFromDOMContainer 方法
return new ReactRoot(container, isConcurrent, shouldHydrate);

// ReactDOM.js  LINE 365  ReactRoot 方法
const root = createContainer(container, isConcurrent, hydrate);

// ReactFiberReconciler.js LINE 275   createContainer方法
return createFiberRoot(containerInfo, isConcurrent, hydrate);
```
以上是对上一节内容的一个整理，接下来我们就看看 `createFiberRoot` 是何方神圣。  

首先是引入点...   
```js
// ReactFiberReconciler.js LINE 39 
import {createFiberRoot} from './ReactFiberRoot';
```
`ReactFiberRoot.js`
```js
export function createFiberRoot(
    containerInfo: any,
    isConcurrent: boolean,
    hydrate: boolean,
): FiberRoot {
    // 创建了一个初始化之前的 Fiber对象
    const uninitializedFiber = createHostRootFiber(isConcurrent);
   
    let root;
     // 省略了一些 Fiber 对象属性的挂载
    //详情可以看下一段（BaseFiberRootProperties）分析  
    
    uninitializedFiber.stateNode = root;
    // 最终要求返回一个 FiberRoot对象
    return ((root: any): FiberRoot);
}
```

我们避不开的要看看这个Fiber的一些属性(也就是那些和组件更新有关的一个个属性)
```js
// ReactFiberRoot.js LINE 32   
type BaseFiberRootProperties = {|
  containerInfo: any, // 也就是 render方法传入的第二个参数，内容的挂载点。。。。。。
    pendingChildren: any, // 在持久化更新中会被用到，在服务端渲染中会被用到
    current: Fiber, // FiberRoot 会和一个 Fiber 对象相对应 ，这里的Fiber是Fiber树的顶点   TODO: 在下一节Fiber详细说明
    // 下面是几个在调度中用到的时间参数
    earliestSuspendedTime: ExpirationTime,
    latestSuspendedTime: ExpirationTime,
    earliestPendingTime: ExpirationTime,
    latestPendingTime: ExpirationTime,
    latestPingedTime: ExpirationTime,
    pingCache:
    | WeakMap<Thenable, Set<ExpirationTime>>
    | Map<Thenable, Set<ExpirationTime>>
    | null,
    didError: boolean, // 标记在应用在渲染过程中是否出现了错误
    pendingCommitExpirationTime: ExpirationTime, // 正在等待任务提交的 expirationTime  TODO: 
    finishedWork: Fiber | null, // 在一次更新渲染中已经完成了的任务,每次更新都会执行一个优先级最高的任务，被执行过的任务们就会被记录到这里   
    timeoutHandle: TimeoutHandle | NoTimeout, // 异步挂载组件相关的超时设置     
    context: Object | null,
    pendingContext: Object | null, 
    +hydrate: boolean, // 标记应用是否要被和之前的合并
    nextExpirationTimeToWorkOn: ExpirationTime, // 用于记录这次更新要执行的哪一个任务？用于作为更新基准
    expirationTime: ExpirationTime, // 与上一个配合使用
    firstBatch: Batch | null,
    nextScheduledRoot: FiberRoot | null, // 当一个应用中 有多个Root的时候才使用   
|};
```
___ 

### 第三节 Fiber  
每一个ReactElement都会对应一个Fiber对象，比如说class Component中我们常用的`state`和`props`都是记录在这个组件对应的`Fiber`对象上的。只有当Fiber更新之后，才会挂载到`this.state`和`this.props`。   

当然，我们这里说的ReactElement，也包括funcational  component而不仅仅是class component，也就是说即使是funcitional Component也是可以获取到这个Component更新前后的stste和props的，即使functional component是没有this对象的。        

Fiber主要用于记录节点的各种状态。     

还有一个功能就是用于串联整个应用，形成树结构。     

###### Fiber 数据结构  

```js
// ReactFiber.js LINE 86 
export type Fiber = {|
  // 标记不同的组件类型
  tag: WorkTag,

  // ReactElement中的key属性，用于标记整个节点
  key: null | string,

  // ReactElement的type
  elementType: any,

  // 用于标记 lazy 组件resolve之后，区分这个是 class 组件还是 functional 组件
  type: any,

  // 对应这个节点的实际的一个实例，class 组件对应的是class 组件的实例，而原生节点就是一个DOM节点的实例，若是functional 组件则没有实例   
  // 应用更新完成之后，state和props的变换就是通过这个属性去更新到对象上        
  stateNode: any,
  
  // 指向Fiber树🌲 中的 父节点
  return: Fiber | null,

  // Singly Linked List Tree Structure.
  child: Fiber | null,
  sibling: Fiber | null,
  index: number,

  // 传入的 ref 属性
  ref: null | (((handle: mixed) => void) & {_stringRef: ?string}) | RefObject,
   
  // 当 props 变化的时候，新的props就会先存到这里  
  pendingProps: any,    
  // 当 props 变化的时候，老的props就是 memoizedProps
  memoizedProps: any, 

  // 由于state变化率，用于存储创建了的更新   TODO: 后续会继续了解     
  updateQueue: UpdateQueue<any> | null,

  // 旧的 state
  memoizedState: any,

  contextDependencies: ContextDependencyList | null,

  mode: TypeOfMode,

  // 和生命周期相关的一些属性           
  effectTag: SideEffectTag,
  nextEffect: Fiber | null,
  firstEffect: Fiber | null,
  lastEffect: Fiber | null,

  // 自身的过期时间
  expirationTime: ExpirationTime,

  // 子节点的过期时间
  childExpirationTime: ExpirationTime,

  // This is a pooled version of a Fiber. Every fiber that gets updated will
  // eventually have a pair. There are cases when we can clean up pairs to save
  // memory if we need to.
  // current 和 workInProgress ，可以理解为每一个 Fiber对象都有一个和它对应的Fiber对像，
  // 我们每次操作的都是那个被称为 "workInProgreee"的那个Fiber对象
  // 有利于缓存，减少Fiber对象的创建操作      
  alternate: Fiber | null,

  // 整个节点渲染时间相关的一些信息，用于记录一些过程信息
  actualDuration?: number,
  actualStartTime?: number,
  selfBaseDuration?: number,
  treeBaseDuration?: number,

  // DEV 相关的一些属性 ......
|};
```

我们来看看Fiber是如何利用Fiber对象上的属性去串联起来整个Fiber Tree的
```jsx
class  MyInput React.Component{
    return (
           <div>
             <input type="text" />
           </div>
    )
}
class List extends React.Component{
    return (
           <div>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
           </div>
    )
}
class App extends React.Component{
    return (
           <div>
              <MyInput></MyInput>
              <List></List>
           </div>
    )
}
// 挂载
ReactDom.render(<App />,document.getElementById('root'),null)
```
![FiberTree](/blog_assets/Fiber_Tree.png) 

##### 总结 
我们可以看到FiberTree和DOM-Tree基本是一一对应的关系，因为一个React-Element对象就对应者一个Fiber对象。
> SwainWong有话说：感觉和Vue一个data属性对应一个Dep对象类似。。。    

___
### 第四节 Update 更新    
Update对象用于记录组件状态的改变，每一次操作就会产生一个Update对象，这些update对象存放于UpdateQueue对象中，针对同一个ReactElement对象的变化，可以有多个Update对象同时存在。           

```js
// ReactFiberReconciler.js   LINE 58
import {createUpdate, enqueueUpdate} from './ReactUpdateQueue';     
// LINE 115   
// 调度更新对象        
function scheduleRootUpdate(
  current: Fiber,
  element: ReactNodeList,
  expirationTime: ExpirationTime,
  callback: ?Function,
) {
  // 调试代码.....
  
  // 结合 expirationTime 生成一个 Update对象     
  const update = createUpdate(expirationTime);
  // Caution: React DevTools currently depends on this property
  // being called "element".
  update.payload = {element}; // payload指向当前需要渲染的内容       

  // 处理第三个参数，若是传入的话，则必须是一个function，也可以选择不传入
  callback = callback === undefined ? null : callback;
  if (callback !== null) {warningWithoutStack(typeof callback === 'function',
      'render(...): Expected the last optional `callback` argument to be a ' +
        'function. Instead received: %s.',
      callback,
    );
    update.callback = callback;
  }
  // TODO: 这里多出一个处理 effect的方法，未知作用
  flushPassiveEffects();
  // 
  enqueueUpdate(current, update);
  scheduleWork(current, expirationTime);

  return expirationTime;
}
```
接下来我们看看单个的Update对象     
```js
// ReactUpdateQueue.js LINE 193   
/**
 * @description 方法用于创建一个Update对象，我们你可以看看Update对象里面的数据结构  
 * @param expirationTime 超时时间
 */     
export function createUpdate(expirationTime: ExpirationTime): Update<*> {
  return {
    expirationTime: expirationTime, // 更新的过期时间
    //  0: UpdateState  更新state  
    //  1: RepalceState 替换state  
    //  2: ForceUpdate  强制更新  
    //  3： CpatureUpdate 更新过程中出现了error，可以利用这个CpatureUpdate捕获到，并且渲染出错误    
    tag: UpdateState, // 会根据以上的不同类型的值(也是不同的情况)，进行不一样的操作
    payload: null, // 实际执行操作的内容(可以理解为要被渲染的内容)
    callback: null, // 执行更新后的回调函数     
    next: null, // 指向下一个Update对象(因为Update对象是被存储在UpdateQueue数组里面去的)
    nextEffect: null, // ”side effect“ 先关相关的内容，后面补充说明 TODO:   
  };
}
```
再来看看Update对象的容器--UpdateQueue的数据结构。    
```js
// ReactUpdateQueue.js  LINE 119   
// 定义 UpdateQueue 对象的数据结构
export type UpdateQueue<State> = {
  baseState: State, // 在每次计算 state的时候，会基于一个baseState，在上次渲染后的基础上开始计算  

  firstUpdate: Update<State> | null, // 指向队伍中第一个Update
  lastUpdate: Update<State> | null,  // 指向队伍中最后一个Update

  firstCapturedUpdate: Update<State> | null, // 第一个”捕获类型“的Update对象    
  lastCapturedUpdate: Update<State> | null, // 最后一个”捕获类型“的Update对象    

  firstEffect: Update<State> | null,// 第一个”Side effect“
  lastEffect: Update<State> | null, // 最后一个 ”side effect“

  firstCapturedEffect: Update<State> | null,
  lastCapturedEffect: Update<State> | null,
};
```
看完了Update和它的容器`UpdateQueue`,接着我们看看对这些内容的操作...enqueueUpdate
```js
// ReactUpdateQueue.js   LINE 220
/**
 * @description 用于创建或者更新 UpdateQueue ，要注意同时操作
 *（更新） 两个 Fiiber对象上的 queue,重点基本就在于同步两个queue的内容
 * @param <Fiber> 也就是当前 ReactElement 对应的 Fiber对象   
 * @param <Update> 当前 ReactElement 对应的更新器   
 * @return undefined
 * TODO: 
 * 这里设置 queue1 与 queue2 是为了对应 本体Fiber 和 WorkInProgress(Fiber)上的 UpdateQueue
 * 注意这里 的queue1 和 queue2 是数组(队列)，属于应用类型
 * 是肯定不能全等的，只能去维持 firstUpdate 和 lastUpdate 相同 
 */
export function enqueueUpdate<State>(fiber: Fiber, update: Update<State>) {
  // 取出 fiber 对象中的 alternate 也就是与其对应的那个 影子 Fiber 对象     
  // (也就是上面 👆 第三章 讲到的 每一个Fiber都有一个WorkInProgree 的影子分身)      
  const alternate = fiber.alternate;   
  let queue1; 
  let queue2;
  // 首次渲染 alternate 对象还是 一个 nill ,则会 命中到第一个 if 判断
  if (alternate === null) {
    // 这里内部处理第一次 渲染的队列操作
    queue1 = fiber.updateQueue; // 尝试获取 fiber 对象上的 updateQueue 属性值 
    queue2 = null;
    // 若是 本体 Fiber 对象上的 queue 都是 null 的话，就创建一个新的空的 UpdateQueue 给他
    if (queue1 === null) {
        // 这里的 createUpdateQueue 方法我们就不列举了
        // 其实就是将上面👆 说过的 UpdateQueue 数据对象，所有的属性都置为null 
        // 用这个Fiber对象的当前state 作为 UpdateQueue的baseState值 ,并且返回   
       queue1 = fiber.updateQueue = createUpdateQueue(fiber.memoizedState);
    }
  } else { // 第二次渲染会命中到后续的这个else中     
    // 同时取出这两个 Fiber 对象中的 updateQueue
    queue1 = fiber.updateQueue;
    queue2 = alternate.updateQueue;
    if (queue1 === null) {
      if (queue2 === null) {
        // 若是这两个 updateQueue 都不存在，则说明这个节点从未被更新过任何一次
        // 那么就都创建一个新的 updateQueue 给他们
        queue1 = fiber.updateQueue = createUpdateQueue(fiber.memoizedState);
        queue2 = alternate.updateQueue = createUpdateQueue(alternate.memoizedState);
      } else {
        // 若只有 queue1 存在，那么就将 queue1 克隆到 queue2 上
        queue1 = fiber.updateQueue = cloneUpdateQueue(queue2);    
      }
    } else {
      if (queue2 === null) {
         // 若是 queue1 存在 queue2 不存在，同样是拷贝 queue1 到 queue2 上   
        queue2 = alternate.updateQueue = cloneUpdateQueue(queue1);
      } else {
        // 要是都是 queue 那就皆大欢喜啦......啥都不做......     
      }
    }
  }    
  // 上面是👆 对 queue1、2是否存在做的一些同步工作。。。。。。

  // 接下来要做的是对这两个queue进行添加元素      
  if (queue2 === null || queue1 === queue2) {
    // queue2 不存在 ，或者 queue1 完全等于 queue2，那都只需要更新一个queue就行了  
    // 首次渲染的时候，会名命中第一种☝️ 情况
    // appendUpdateToQueue 的作用是 将这个update 添加到 更新队列 1 中
    appendUpdateToQueue(queue1, update);    
  } else {
    // 进到这里，。说明不是第一次触发更新了...
    // 也说明有两个 queue,并且还都不相等。我们都需要对他们进行更新......  

    // while accounting for the persistent structure of the list — we don't
    // want the same update to be added multiple times.
    // TODO: 上面👆 这两句，暂时不理解，不知道是不是和Vue一样，相同的Update不希望被添加到queue中   

    // 判断queue的lastUpdate === null，是想知道这个queue是不是空的...
    if (queue1.lastUpdate === null || queue2.lastUpdate === null) {
      // 同时更新两个队列
      appendUpdateToQueue(queue1, update);
      appendUpdateToQueue(queue2, update);
    } else {
      // Both queues are non-empty. The last update is the same in both lists,
      // because of structural sharing. So, only append to one of the lists.
      appendUpdateToQueue(queue1, update);    
      // But we still need to update the `lastUpdate` pointer of queue2.
      queue2.lastUpdate = update;
    }
  }
  // 调试代码......
}
```
___
### 第五节 expirationTime 的计算     
