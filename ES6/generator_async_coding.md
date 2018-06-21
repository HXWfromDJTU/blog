# generator实现异步编程

## generator
* `generator` 的 `yeild` 后面跟着的只能够是 `thunk` 或者 `Promise`对象
* `generator`返回的是`iterator`对象，只能够使用执行器进行执行。