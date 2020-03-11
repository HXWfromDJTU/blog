let { Stack } =  require('./stack');

let stack = new Stack(5);

stack.push({key:123});
stack.push(undefined)
// stack.pop();
// stack.pop();
stack.push('another');
stack.push('another');

for(i of stack){
    console.log(i);
}