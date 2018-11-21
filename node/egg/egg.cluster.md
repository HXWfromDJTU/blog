### egg.cluster

#### cluster是什么
多进程模型，解决单核CPU问题，`egg-cluster`是用于 `egg` 多进程管理的基础模块，负责底层的`ICP`通道的简历以及各处理各个进程之间的通信。

`master`表示主进程
`worker`表示主进程`master`的子进程，一般是根据有多少个`CPU`启动多少个这样的进程，用于对外服务，处理各种业务层面的事情
`agent master`的子进程，主要处理公共资源的访问，像是文件的监听，或者是帮助worker处理一些公共事务，处理完后再通知worker

`master`类似于一个守护进程
① 负责 `agent` 的启动、退出、重启
② 负责各个 `worker` 进程的启动、退出、以及`fork`，在开发模式下负责重启
③ 负责 `agent` 和各个 `worker` 之间的通信
④ 负责各个worker之间的通信

master先启动agent，agent成功启动后通过回调通知master，然后master再根据CPU内核数目去启动worker

master和 agent/worker 是real 



