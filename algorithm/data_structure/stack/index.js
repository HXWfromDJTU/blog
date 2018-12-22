let { Stack } =  require('./stack');

let stack = new Stack(5);

stack.push(1);

stack.push(2);

stack.push(3);

stack.push(4);
stack.push(5);
stack.push(6);
for(i of stack){
    console.log('遍历'+i)
}
stack.pop();
stack.pop()
stack.push('another');
stack.push('another');

stack.show();