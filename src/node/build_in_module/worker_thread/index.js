/*
isMainThread：false 表示当前为 worker 线程，true 表示为主线程

parentPort: 在 worker 线程里是表示父进程的 MessagePort 类型的对象，在主线程里为 null

workerData: 在 worker 线程里是父进程创建 worker 线程时的初始化数据，在主线程里是 undefined

threadId: 在 worker 线程里是线程 ID，在父进程里是 0。

MessageChannel: 包含两个已经互相能够夸线程通信的 

MessagePort 类型对象，可用于创建自定义的通信频道，可参考样例二的实现。

MessagePort: 用于跨线程通信的句柄，继承了 EventEmitter，包括 close message 事件用于接收对象关闭和发送的消息，以及 close postMessage 等操作。

Worker:  主线程用于创建 worker 线程的对象类型，包含所有的 MessagePort 操作以及一些特有的子线程 meta data 操作。构造函数的第一个参数是子线程执行的入口脚本程序，第二个参数包含一些配置项，可以指定一些初始参数。

*/



const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const request = require("request");


if(isMainThread) {
	console.log("This is the main thread")

	let w = new Worker(__filename, {workerData: null});
	w.on('message', (msg) => { //A message from the worker!
		console.log("First value is: ", msg.val);
		console.log("Took: ", (msg.timeDiff / 1000), " seconds");
	})
	w.on('error', console.error);
	w.on('exit', (code) => {
		if(code != 0)
	      	console.error(new Error(`Worker stopped with exit code ${code}`))
   });

	request.get('http://www.google.com', (err, resp) => {
		if(err) {
			return console.error(err);
		}
		console.log("Total bytes received: ", resp.body.length);
	})

} else { //the worker's code

	function random(min, max) {
		return Math.random() * (max - min) + min
	}

	const sorter = require("./test2-worker");

	const start = Date.now()
	let bigList = Array(1000000).fill().map( (_) => random(1,10000))

	sorter.sort(bigList);
	parentPort.postMessage({ val: sorter.firstValue, timeDiff: Date.now() - start});

}
