# Redux 数据流
### 为什么要使用数据流
* react使得状态可预测
* 数据流是用户行为的响应与抽象
* react是一个纯View框架，所以需要一个插件去进行数据流管理的工作

### 与eventBus的比较(传统MVC)
* 对于一个简单应用，或者说是一个大型应用的开发初期，`eventBus`的确能够满足基本的需要，而且编写起来简单明确
* 当一个应用开始复杂起来，用户的简单的一个点击操作，影响到的可能是很多的个模块的很多个页面，如下图:
[!tooMuchEventBus](../blog_assets/eventBus.png)

### 与flux的比较
* `flux` 将用户所有的行为`action`统一使用一个`dispatcher`进行`分发`，一个`action`只能给一个或者多个`store`传递状态，`store`保存了数据，也同时保存当时页面的状态。`store`能够修改view，但是`view`不能够反过来作用于`store`
