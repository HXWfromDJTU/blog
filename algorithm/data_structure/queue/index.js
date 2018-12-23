let {Queue} = require('./queue');


global.seriesHeapSize = 5;
let queue = new Queue(5);


queue.enqueue(1);
queue.enqueue(2);
queue.enqueue(3);
queue.enqueue(4);
queue.enqueue(5);
queue.enqueue(6);
queue.log()
queue.dequeue();
queue.dequeue();
queue.enqueue(5);
queue.enqueue(6);
queue.log()