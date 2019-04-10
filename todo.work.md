### 离线缓存与 Service Workers   
[参考文章](https://segmentfault.com/a/1190000008491458)   
___
### typescript 

___
### 进程间通信    
通过ipc进行进程间通信  

___
### RPC了解与进阶   

### 异步
`渲染进程`  
发送事件 `asynchronous-message`，接收事件`asynchronous-reply` 
```js
const ipc = require('electron').ipcRenderer

const asyncMsgBtn = document.getElementById('async-msg')

asyncMsgBtn.addEventListener('click', function () {
  ipc.send('asynchronous-message', 'ping');
})

ipc.on('asynchronous-reply', function (event, arg) {
  const message = `异步消息回复: ${arg}`
  document.getElementById('async-reply').innerHTML = message
})
```      


`主进程`  
发送事件 `asynchronous-reply`    监听事件 `asynchronous-message`   
```js
const ipc = require('electron').ipcMain

ipc.on('asynchronous-message', function (event, arg) {
  event.sender.send('asynchronous-reply', 'pong')
})
```

### 同步
`渲染进程`        
发送事件 `synchronous-message`，接收事件`synchronous-message` 
```js
const ipc = require('electron').ipcRenderer

const syncMsgBtn = document.getElementById('sync-msg')

syncMsgBtn.addEventListener('click', function () {
  const reply = ipc.sendSync('synchronous-message', 'ping')
  const message = `同步消息回复: ${reply}`
  document.getElementById('sync-reply').innerHTML = message
})
```   


`主进程`          
发送事件 `synchronous-message`   监听事件 `synchronous-message`   
```js
const ipc = require('electron').ipcMain

ipc.on('synchronous-message', function (event, arg) {
  event.returnValue = 'pong'
})
```

___

### native 与 web   

native 

回调函数   

postMessage   传id    RPC2.0协议    

本地化



### web3.js       
web3.js可以与任何暴露了RPC借口的以太坊节点连接。      

web3中有eth对象      


### RPC       
`请求的消息内容`        

RPCP全称是Remote Producedure Call Protocol,在各互联网公司章被广泛使用。      

使用代理来实现。   

怎么对消息进行编码和解码？   

消息结构需要包括以下内容：   

接口名称、方法名、参数类型  

参数类型参数值    

超时时间     

requestId标识唯一的请求id。   用于保证请求与返回的对应。      

`返回的消息内容`        
返回值，状态code，requestID      

`系列化与反序列化`     
关注点： 1️⃣ 兼容的数据类型 2️⃣ 编译的速度。    3️⃣ 可扩展性、对于互联网公司而言，业务变化快。序列化协议最好具有良好的拓展性。   


 

###  2019/03/29 分享会   

BTC     
聪 10 ^ 8 1 BTC 


256位随机数，左侧补零   

WIF格式的私钥地址   

BTC公私钥的压缩     

utxo模型    一个TX可以包含多个转账操作    

data OPCODE   

地址是由 多个  OPCODE组成
http://learnmebitcoin.com/glossary/p2pkh   

BIP 11  

多签，赎回脚本   

地址通过hash可以变成一个定长的一个东西，则     

`BIP 32`  定义了了HD钱包的基础内容     

`BIP 44` 对于钱包比较重要   account 与 钱包    

`BIP 68`   使用 sequence 来进行一个交易冷却机制，交易得到的钱      

unspend


HDWallet 

Wallet缓存的一些东西   

矿工费的计算？耗电量。     


### webpack 配置        

使用`webpack --mode=production`或者是不做配置，则会默认启动`FlagDependencyUsagePlugin`, `FlagIncludedChunksPlugin`, `ModuleConcatenationPlugin`, `NoEmitOnErrorsPlugin`, `OccurrenceOrderPlugin`, `SideEffectsFlagPlugin` 和 `UglifyJsPlugin`.        

使用`webpack --mode=development`开发模式没会自动启动`NamedChunksPlugin` 和 `NamedModulesPlugin`插件。      

[link](https://www.webpackjs.com/concepts/mode/)   


### javascript 迁移到 typescript   
Object.assign 在ts中无效          
[参考文章](https://stackoverflow.com/questions/38860161/using-typescript-and-object-assign-gives-me-an-error-property-assign-does-no)        



### typescript 模块化   

`Typescript`沿用了`Javascript`中`ECMAScript`模块的概念，

