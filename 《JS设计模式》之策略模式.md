# JS设计模式 之 策略模式

>策略模式是将一系列的算法，将其封装起来。
实现`算法的使用`与`算法的实现`分离开来，使得他们可以一个个相互替换。

比如一个计算工资的功能实现
实际的流程分支代码context中，并没有计算功能的功能，而是将计算的实体交给了不同的函数
策略模式也是对象堕胎的一个表现
```js

//  低效的方法
var persormanceS =function(salary){
    return salary * 4;
}
var persormanceA =function(salary){
    return salary * 3;
}
var persormanceB =function(salary){
    return salary * 2;
}

var calculateBonus =function( performanceLevel, salary){
    if( performanceLevel ==='S'){
        persormanceS(salary)
    }
    if( performanceLevel === 'A'){
        persormanceA(salary)
    }
    if( performanceLevel === 'B'){
        persormanceB(salary)
    }
}
```
```js

//  高效的办法
//实现对象
var strategies = {
    "S":function(salary){
        return salary * 4 
    },
    "A":function(salary){
        return salary * 3 
    },
    "B":function(salary){
        return salary * 2 
    }
}
// 控制对象
var calculateBouns = function(salary){
    return strategies[level](salary)
}

```
