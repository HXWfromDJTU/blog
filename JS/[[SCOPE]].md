#  Javascript作用域链
执行环境   :arrow_right:  作用域链  :arrow_right:  变量对象
每个执行环境都有一个`[ [scope] ]`变量，指向对象的的作用域链，作用域链上的每个栏位都存放着对应的函数空间的变量对象。
### 执行环境
函数在创建的时候，会创建一个执行环境(`excution context`)对内部对象，他定义了一个函数执行时的环境

函数每次执行时，执行环境都是独一无二的，多次调用就有多个执行环境

每个人执行环境都有自己的作用域链，用于解析标志符

每个`执行环境`都有一个与之关联的变量对象(`variable object`)，环境中定义的所有`变量`和`函数`都保存在这个对象中

`全局环境`是最外围的一个`执行环境`，随着`ECMAScript`的真实环境变化而变化，常见的是`global`和`window`

某个执行中的代码执行完毕，该环境被销毁，保存在其中的所有变量和函数定义也随之销毁。
### [ [scope] ]
`[ [scope] ]`和执`行期上下文`虽然保存的都是作用域链，但是不相同。
`[ [scope] ]`属性在函数创建饿时候产生，会一直存在
执行上下文在函数执行的时候才产生，函数执行完后便销毁

### 作用域栈
每个函数都有自己的执行环境，每当执行流进入一个函数时，当前函数的环境就会被推入一个`环境栈`中。当函数执行完后，栈将其环境弹出，把控制权返回给外层执行环境。

### 作用域链
* 开始执行的时候，作用域链上只有全局对象，并保存在内部属性`[[SCOPE]]`上。
* 调用某个函数的时候，会取出之前存有全局对象的`[[scope]]`，并把当前函数的活动对象，追加到取出的全局对象中，形成新的作用域链，再次存入`[[SCOPE]]`。
* 代码在一个环境中执行时，会创建变量对象的一个作用域链。
___
### 实例理解
```js
var name = "Andy";

function changeGlobalName(){
    let innerName = "innerName"
    name = "Jacky"
    function changeInnerName(){
         let tempName = "innerInnerName";
         innerName = "changeByInnerInner"
    }
    changeInnerName()
}
changeGlobalName()
```
### `执行环境` 与 `作用域链`
`window`       (`name`  `changeGloalName`)       
&nbsp;&nbsp;&nbsp;&nbsp;  :arrow_up:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  :arrow_up:
`changeGlobalName`  (`arguments` `inner` `changeInnerName`)
&nbsp;&nbsp;&nbsp;&nbsp; :arrow_up:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  :arrow_up:
`changeInnerName` (`arguments` `tempName`)
&nbsp;&nbsp;&nbsp;&nbsp; :arrow_up: 

* 每个环境都可以向上搜索作用域链，以查询变量和函数名。但任何环境都不能通过向下:arrow_down:搜作用域链进入另一个执行环境

### 作用域类型
一般来说`Javascript`的作用域只有：`全局作用域`和`函数作用域`。

还有两种不常使用的`with` 和 `catch` 语句。
在严格模式下，`with`是被禁止使用的。
___
### 参考文档 
[JavaScript内部属性 Scope 与作用域链及其性能问题 - CSDN](https://blog.csdn.net/q1056843325/article/details/53086893?locationNum=12&fps=1)

[稳扎问打Javascript - by 柴毛毛](https://blog.csdn.net/u010425776/article/details/53557942?utm_source=copy)
