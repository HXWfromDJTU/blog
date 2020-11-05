## 前言
[![npm version](https://badge.fury.io/js/mobile_bridge_js.svg)](//npmjs.com/package/mobile_bridge_js)    [![Generic badge](https://img.shields.io/badge/github-mobile_bridge_js-<COLOR>.svg)](https://github.com/HXWfromDJTU/mobile_bridge_js)

一个客户端`webview`中加载的`h5`应用与`Native`通信工具，持续完善中....[传送门 👉👉](https://github.com/HXWfromDJTU/mobile_bridge_js)
### 设计思路
![](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/blog_assets/bridge_workflow.png)

### 主要构成
![](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/blog_assets/bridge_uml.png)   


<!-- * 通信信道
    * 使用Iframe
    * 使用Native Channel
    * messageHandlers
* 区分一般请求 和 通知
* 请求缓存区，收发制度  
* promise 封装
* 客户端的webview 用于加载sdk,dapp可以方面也加载sdk,则可以实现双方互相监听的效果。
    * 如何区分是来自于 mobile_bridge_sdk的呢？而不是其他sdk呢？
* eventEmitter
* 异常类型的封装、参数错误抛出的异常
   * 错误码设计
   
* otherWindow 要注意，是指被发送消息的窗口 

## 设计模式
* 一发一收    
* 一发多收(发布订阅)     
* 不订阅，也主动推送。(双向都可)

## 图例
* 参考了 `electron`的多窗口、跨进程通信的设计思维    
* 需要补充一个思维导图      

### webapi 
* Iframe 的特性，当下的用途在哪里？如何判断当前页面是否处于Iframe之中
* postMessage
* window.top window.self

## 客户端API
* ios 端 如何进行 messagerHandler 的绑定
* android 如何进行 postMessage的绑定

### 工具
* log-level
 * 一个优秀的sdk，必须要可以保证日志的可追随性
 * 在iOS的控制台下，难以查看到JavaScript的日志，所以我们在 JavaScript 打印日志的时候，也同时向着 iOS 端发送了消息，同步日志
 
### 构建与发布
* cjs、esm、amd 格式
* npmjs托管
* HtmlWebpackPlugin、DefinePlugin 是做什么的？为什么要这么用？

### 测试模块
* dev测试
* 可视化测试页面的搭建

![](/blog_assets/mobile_bridge_playground.png) -->

## 参考资料
[1] [window.postMessage - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage)      
[2] [logger-level - github](https://github.com/pimterry/loglevel)    
[3] [webpack - ts-loader](https://webpack.js.org/guides/typescript/)       
[4] [JavaScript WebView and iOS](https://www.vivekkalyan.com/javascript-webview-and-ios)    
[5] [JSON-RPC 2.0](https://www.jsonrpc.org/specification)      
[6] [Android与Javascript互相调用 - 简书](https://www.jianshu.com/p/f5c77a655ea6)    
