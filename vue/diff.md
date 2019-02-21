# diff算法与v-node的patch

watcher对象调用对应的`update`来修改视图，核心是将新的vnode和旧的vnode进行一个`patch`的过程，得到差异，然后就只将差异更新到视图上。     

#### insert
```js
function insert(parent,elm,ref){
     if(parent){
         // 如指定了ref属性则插入到ref这个子节点前面       
         if(ref){
             if(ref.[parentNode === parent]){
                 nodeOps.insertbefore(parent,elm,ref);
             }
        // 否则则插入到这个节点的内部
         }else{
             nodeOps.appendChild(parent,elm)
         }
     }
}
```  

#### createElm 
用于创建一个节点，若vnode的tag属性存在的话，则创建一个标签型节点，否则则创建一个文本节点。    

```js
function createElm(vnode,parentElm,refElm){
    if(vnode.tag){
        // 读取标签名称    
        insert(parentElm,nodeOps.createElement(vnode.tag),refElm)
    }else{
        // 使用vnode的text属性作为内容
        insert(parentElm,nodeOps.createTextNode(vnode.text),refElm)
    }
}
```


#### addVnodes
用于批量创建节点，每一个vnode都会有自己的 vnode - id，批量创建就是从指定的起始id到结束id的vnode转化为节点的过程
```js
function addVnodes(parentElm,refElm,vnodes,startIdx,endIdx){
    // 从起始到终止，循环
    for(;startIdx <=endIdx;++startIdx){
       creatElm(vnodes[startIdx],parentElm,refElm); // 创建节点
    }
}
```

#### removeNode 
用于移除节点
```js
// 删除单个节点     
function removeNode(el){
    const parent = nodeOps.parentNode(el);
    if(parent){
        nodeOps.removeChild(parnent,el)
    }
}
```

#### removeVnodes 
用于批量删除节点
```js
// 批量删除节点
function removeVnodes(parentElm,vnodes,startIdx,endIdx){
     for(;startIdx <= endIdx;++startIdx){
         const ch = vnodes[startIdx]; //取出对应 id 的vnode  
         if(ch){
             removeNode(ch.elm); // 循环调用移除单个节点的方法
         }
     }
}

```  

工具方法就介绍完了，一下开始`patch`过程的说明
___

patch的过程

diff算法时候用的是Vnode树结构的同层比对，时间复杂度只有O(n) 


```js
// patch过程
function patch(oldNode,vnode,parentElm){
    // 判断是否存在旧的vnode节点, 若不存在旧节点，则直接插入新节点
    if(!oldVnode){
        // 传参含义：在指定父节点下，插入指定的vnodes
        addVnodes(parnetElm,null,vnode,0,vnode.length-1);
    // 若新节点不存在的时候，说明要用“空”代替旧节点，也就是说新的DOM中旧节点被删除了  
    } else if(!vnode){
        // 传参含义：将指定父节点下的旧节点中，从0，到父节点长度的所有节点都删除。    
        removeVnodes(parentElm,oldVnode,0,oldVnode.length-1); 
    }else{
        // 当新旧节点，二者都存在的时候。我们就要判断二者是否相同的DOM节点?（也就是各项基本属性向都相同的）
        if(sanmeVnode(oldVnode,vnode))
            // 进行深度对比
            patchVnode(oldVnode,vnode);
        }else{
            // 若不是相同节点，则删除旧节点，并且添加新节点        
            removeVnodes(parentElm,oldVnode,0,oldVnode.length-1);
            addVnodes(parentElm,null,vnode,0,vnode.length-1);
        }
    }
}

``` 

#### sanmevNode  
```js
function sameVnode(a,b){
    return (
        a.key === b.key &&  // 相当于id
        a.tag === b.tag &&  // 标签名
        a.isComment === b.isComment   // 是否备注
        a.data === b.data && // 数据/value是否相等
        sameInput(a,b)    // 若同样是 input 则 type是否相同
    )
}
```  

#### patchVnode
patchVnode是主要的patch过程，也就是当新旧节点符合sameVnode的条件下才会进行的工作。     
```js
function patchVnode(oldVnode,newVnode){
    // 新旧两个节点若原本就是指向同一个内存对象，那肯定是相同的，则不进行操作     
     if(oldVnode === newVnode){
         return;
     }
     // 当新老节点都是 isStatic节点(静态节点)时，并且key也相同的时候，只要将旧节点的 componentInstance和 elm 属性直接拷贝到新节点上即可   
     if(oldVnode.isStatic && newVnode.isStatic && oldVnode.key === newVnode.key){
         newVnode.elm = oldVnode.elm; // 旧节点对应的DOM对象拷贝到新节点上   
         newVnode.componentInstance = oldVnode.componentInstance; // 旧节点对应的组件实例拷贝到新节点上
     }
     const elm = newVnode.elm = oldVnode.elm; // 取出新旧Vnode对应的元素
     const oldCh = oldVnode.children;  // 取出旧节点的子节点
     const newCh = newVnode.children // 取出新节点的子节点
     // 若新的节点是文本节点，则进行文本的更新   
     if(newVnode.text){
         nodeOps.setTextContent(elm,node.text);
     }else{
          // 如果新节点和旧节点的子元素都存在，并且相等的话
          if(oldCh && newCh && (oldCh !== newCh)){
              // 更新子节点为新节点
              updateChildren(elm,oldCh,ch);
          }else if(newCh){ // 若只有新节点
              // 若旧节点是个文本节点，则设置为''
              if(oldVnode.text){nodeOps.setTextContent(elm,'');};
              // 那就直接添加新节点
              addVnodes(elm,null,newCh,0,newCh.length-1);
          }else if(oldCh){ // 若只有旧节点
              // 那么久将旧节点移除     
              removeVnodes(elm,oldCh,0,oldCh.length-1);
          }else if(oldVnode.text){ // 若旧节点只是个文本节点     
              // 则清除旧结点内容
              nodeOps.setTextContent(elm,'');
          }
     }
}
```  

#### updateChildren 
```js


```
1️⃣ 首先在oldVnode和新的 newVnode前后两端分别标上索引     

2️⃣ 每轮都首先进行四种sanmeNode比较，`首先`头节点和头结点相比较，`再者`尾节点和尾节点作比较，这两次比较若结果若有true的，则对两个比较者进行`patchVnode`。`然后`再用旧节点的首节点和新的末节点相比，`最后`使用新的头结点和旧的末节点相比，若这两组对比，出现符合sanmeNode条件的话，则将对应oldNode用于比对的节点移动到尾部和头部。     





#### 疑问 
1️⃣ 为什么要使用两端对比？   
单端对比发现不一致的时候，需要进行元素(实际DOM)的移动。而使用两端对比，则没有这个问题。     

2️⃣ 针对删除节点来说。最终删除的是oldStartIdx指向的位置。 


