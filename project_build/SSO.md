# 单点登录  

#### single-sign-on




所谓的单一登录是指用户在一个站点如map.baidu.com登录后切换到另一个站点tieba.baidu.com时也自动 被tieba的Server判断为已经登录，反过来，只要用户在map.baidu.com登出后，切换到 tieba.baidu.com时后www的Server也会判断到这一用户已经登出。

还有另外一种跨主站的登录状态共享，可以采用类似`Passport`的策略去实现。   


