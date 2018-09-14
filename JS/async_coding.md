#  实现异步的编程方法
## 使用`setTimeout`
```js
 let asyncAction =   setTimeout(_=>{
     consle.log("异步执行")
 },0)
 // 时间延迟设为0，仅仅将代码拖到本轮任务队列
```
## 使用`Promise`
```js
  let imgLoading = new Promise((resolve,reject)=>{
      img.src="www.hahaha.com/xxx.bmp";
      img.load = _=>{
          resolve()
      }
  }).then(_=>{
      console.log("异步执行")
  })
```
## 使用`async`
* 举例： 后一个异步请求依赖前一个的操作结果
```js
const asyncRequest  = async ()=>{
    const data = await getJSON();
    if(data.needAnotherRequest){
        const moreData = await makeAnnotherRequest(data); // 使用另一个promise去请求数据
        console.log(moreData);
        return moreData
    }else{
        console.log(data);
        return data;
    }
}
```

## generator
```js
const person = sex => {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      const data = {
        sex,
        name: 'keith',
        height: 180
      }
      resolve(data)
    }, 1000)
  })
}
function *gen () {
  const data = yield person('boy')
  console.log(data)
}
const g = gen()
const next1 = g.next() // {value: Promise, done: false}
next1.value.then(data => {
  g.next(data)
})
```
### setImmediate
`setImmediate()`: 是被设计用来一旦当前阶段的任务执行完后执行。
`setTimeout()`: 是让代码延迟执行。
