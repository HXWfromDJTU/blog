## Promise A+ 规范与 手工实现  


#### 简述
1️⃣ Promise是一个容器  
2️⃣ 

#### Step 1
没有头绪？我们可以根据现有的调用情况来看看，一步步来
![](/blog_assets/Promise_Design.png)

```js
/**
 * 按照Promise A+ 规范实现  
 * 
 */


class Promise(){
    constructor(fn){
        this[PromiseState] = 'pending'; // 还会变成 fulfill rejected 
        this[PromiseValue] = undefined;
        
        onFulfillMap.set(this,[]);
        onRejectMap.set(this,[]);
        nextPromiseMap.set(this,[]); 
        
        }
    
       try(typeof fn === 'function'){
           const [resolve,reject,status] = excute()
       }

    

    }

}
```