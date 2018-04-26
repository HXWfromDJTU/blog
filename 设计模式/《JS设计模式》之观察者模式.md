# 观察者模式 or 发布订阅者模式
### 什么是观察者模式？
`观察者模式`也就是我们常说的`发布/订阅者模式`，基本的意思是：两个对象，一个对象会根据另一个对象的状态发生变化而发生变化。（😅舌头打结）。
### 现实的例子
打个比方，学校里有个女神，你想撩她。
但是女神说我现在有男朋友啦，不能和你交往，等我分手的时候你再来吧。😭
但是，你怎么知道女神什么时候没有男朋友，总不能每天都跑去问吧。😂
.....放弃？
女神有一天告诉你...我们要不加个微信吧....要是我分手了，会给你发个私信告诉你的。
加微信这个动作就类似于订阅的行为...证明你已经成为第X号备胎😅
当然，女神肯定不止一个人追，她的备胎列表中，肯定收集了很多个备胎。
当现男友变成前男友，女神朋群发一次私信，各路备胎就收到了消息，女神再次`avaliable`了。

总结一下：
* 女神就是信息的发布者，通信录里存留着许多备胎的联系方式
* 你和众多追求者都是`女神情感状态变化`这一事件的订阅者。事件发生之后，你还会做一些事情，比如，女神一分手，你就会发私信撩她。女神一谈恋爱，你就祝她幸福。💚
* em~讲到这里，FEer们都明白了，这不就是事件监听和执行回调吗？😂

### 实际开发中的应用
* FNer在jQ时代最常见的工作可能就是，问后端要接口，然后`ajax`调用，然后bulabula地刷新这儿那儿的dom元素内容的。
```js
$.ajax("xxx.php?id=123",{
    success:data=>{
    header.refresh()
    footerre.freash()
    myForm.check()
    //.....N多事情
    }
})
```
过多的回调操作，会造成ajax的臃肿
要是你休假在和女神约会的时候，你的同事一个电话过来，说：麻烦在你的回调里面添加一个弹出热销推送的功能，你的回调代码辣么多，表示不敢碰。Orz....GG
* 针对这样的情况，我们可以用`发布/订阅者`模式来改写
```js
$.ajax("xxx.php",{
    success:data=>{
        //假设 buy是一个模块(发布者)
        buy.trigger("buySuccess",data)
    }
})
// header模块中
buy.listen("buySuccess",function(data){
    header.refresh(data);
})
//footer模块中
buy.listen("buySuccess",function(data){
    footer.refresh(data);
})
//myform模块中
buy.listen("buySuccess",function(data){
    myForm.check(data);
})
//同事在你调戏妹子时候新增的代码😈
buy.listen("buySuccess",function(data){
    hotsale.refresh(data);
})
```
这样子，就实现了你和妹子的解耦，不用每天都去问她感情状况。也实现了你和同事的解耦，你写你的他写她的。

### 多订阅者/多发布者的情况
>当女神不止一个，而在你看来追哪个女神都是愿意的，所以并不关心哪个女神失恋了，只要是女神失恋了，你就想知道，然后采取行动...

* 这个时候呢，我们就需要一个中间商来赚差价？(咦？走错片场...)我们需要一个媒介，不管谁哪个女神失恋了，女神都会发一个朋友圈，朋友圈收到了，所有的关注者都能看到消息，纷纷都采取了行动。
* 其实与上面第一种情况不同的地方仅仅在于，你收到消息不是直接来自女神，而是来自于中介。

许多`FEer`已经能够想到，这个就是`Vue`中经常使用的`eventBus`，朋友圈相当于一个失恋事件中转站。失恋事件发生了，所有的追求者监听到了事件，纷纷执行各自的回调。
```js
var eventBus = new Vue();
//goddness component
goddness.trigger("breakup",function(girlsName){
   eventBus.$emit("breakup");
 })
//boy1 component
mounted{
   eventBus.$on("breakup",function(girlsName){
     console.log("i can have a date with "+girlName)
   })
}
//boy2 component
mounted{
   eventBus.$on("breakup",function(girlsName){
     console.log("i am free to send flowers to "+girlName)
   })
}
```

### 订阅的回调
>但是小王鄙视你们盲追女神的行为，他表示只爱村口小花一个。除了小花，其他女神失恋了就都不要告诉我了。

* 小王打开了朋友圈设定，过滤掉了其他女神的朋友圈，钟爱一人。
* 朋友圈服务器接到小王的设置，默默给小王的回调添加了`key=="xiaohua"`
小王的设定，相当于在执行`listen`监听的时候，设定了接受发布的要求，大概代码如下
* 朋友圈初始化
```js
var friendZone = {};
//追求者名单
friendZone.chaserList = [];
//添加追求者
friendZone.listen = function(key,fn){
//这里的key为女神的名字
if(!this.chaserList[key]){
  this.chaserList = [];
 }
 //给这个女神的追求者列表添加不同人的回调函数
this.chaserList[key].push(fn)
}
//发布失恋消息
friendZone.trigger = function(){
//取出参数列表的第一个内容，也就是女神的名字
var key = Array.prototype.shift.call(argument)；
//调出该女神对应的所有追求者的回调函数数组
var fns = this.chaserList[key];
//若该女神暂时还没有追求者(i_i!)，则不作做何事情
if(!fns || fns.length === 0 ){
  return false;
 }
 for(var i= 0,fn;fn = fns[i++];){
   fn.apply(this,arguments )
 }
}
```
* 朋友圈接受用户设定
```js
//喜欢小花的小明，通过朋友圈，默默对小花失恋这件事进行了订阅
friendZone.listen("xiaohua",function(){
    console.log("my love xiaohua is free to be chased");
})
```
### 其他实际应用
>VueJS双向绑定的依赖实现

从另一篇文章[Vue双向绑定](https://github.com/HXWfromDJTU/blog/blob/master/vue/Vue%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB%E4%B9%8B%20%E5%8F%8C%E5%90%91%E7%BB%91%E5%AE%9A.md)跳过来的同学，已经大概明白了。`Dep对象`和`Watcher对象`就是一组`发布者\订阅者`的例子。
```js
function Dep(){
   this.subs = [];
   //依赖收集
	this.addSub = function (watcher) {
		this.subs.push(watcher);
	}
	this.notify = function(){
		this.subs.forEach(function(watcher){
			watcher.update();
		});
	}
}
//数据管理者
function Watcher(fn){
	this.update = function(){
		Dep.target = this;
		fn();
		Dep.target = null;
	}
	this.update();
}
//observer类中给变量设置的get/set监听
 	get: function(){
    		if (Dep.target) {
    			dep.addSub(Dep.target);
    		};
    		return value;
    	},
    	set: function(newVal){
    		value = newVal;
    		dep.notify();
    	}
```
用户通过给变量设置`get/set`监听，在初次`update`的时就触发了`get`，然后Dep收集该数据对应的Watcher对象。之后每一次的set操作，都会通知Watcher去执行update，更新数据更新DOM

### 先发布后订阅可以吗？
此时，你以为你就可以和女神双宿双飞了
但是，你的行为刺激到了单身狗PM，PM提出了个变态的要求😤：
>新用户注册并登录，并且订阅了某个精细分类之后，要把过去一个月这个分类的热销推送，一并推送给他。
[雷劈脸]什么？事件已经发生了，怎么监听到呢？药丸药丸....

具体实现，推荐大家去看这位大神的博客，我的归纳稍后日子再整理啦，[传送门](https://www.cnblogs.com/stoneniqiu/p/6814468.html)
