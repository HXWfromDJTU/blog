

class Obserbver{
       constructor(obj,key,value){
            // 建立一个Dep对象用于收集关于这个数据的依赖
            this.dep = new Dep();
            // 若对应的建位值是对象，则继续遍历  
            if(Object.prototype.toString.call(obj[key])=='[object Object]'){
                 Object.keys(obj[key]).forEach((_value,index)=>{
                      new Obserbver(_value);
                 })
            }
            // 设置属性  
           Object.defineProperty(obj,key,{
               configurable:true,
               enumerable:true,
               get(){
                    dep.addSup(Dep.target);
                    return this.value;
                 },
                set(newVal){
                     this.value = newVal;
                     this.dep.notify();
                 }
           })
           
       }
}


class  Dep{
     constructor(){
          this.sup = []; // 维护一个数组用于收集依赖
     }
     addSup(watcher){
        this.sup.push(watcher);
     }
     notify(){
          this.sup.forEach(watcher=>{
               watcher.update();
          })
     }
}

class Watcher{
     constructor(renderFun){
          Dep.target = this;
          this.renderFun = renderFun;
          this.renderFun();
          Dep.target = null;
     }
     update(){
         this.renderFun(); 
     }
}


let data = {
     key1:123,
     key2:456,
     key3:789
}


Object.keys(data).forEach(key=>{
     new Obserbver(data,key,data[key]);
})