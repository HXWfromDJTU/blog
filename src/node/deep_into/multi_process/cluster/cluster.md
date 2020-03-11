# cluster源码简析 与 egg-agent
> 综合理解 node下的 child_process模式、cluster模式与egg的多进程模式之间的异同点

### child_process
child_process是我们入门多进程编程的第一个模块包，我们前面在child_process模式下也实现过一个相对完善的多进程简单架子。 复习一下？[传送门👉](/node/deep_into/multi_process/child_process/)    
例子中我们在master中开启了一个http的对外服务，并同时开启了最大量的进程数目，锦城湖


### 简述 


NODE_UNIQUE_ID 是一个从零开始递增的整数，在每一个fork出来的子进程上都会有一个   

workerInit   masterInit  

设定监听的端口，只在master中监听了一次。  

不会出现端口重复被监听而报错，


实现的模型和 cp模式下的模型几乎一致

不同于处理异常的位置与方法  

SO_READDRESS

##### cluster与child_process的区别在于 
child_process对子进程的控制并不像cluster这么绑定
1️⃣ 比如说我们可以通过在child_process模块在master中开启多个tcp服务器(或者http服务器)对外，然后这个模式下的worker就可以实现监听多个端口的请求了，而这一点cluster做不到。     

2️⃣ 亦或者我们可以在child_process模式下，管理多个服务器下的多个进程组，也就实现了一个端口作为入master，而多个服务器下的多组子进程作为我们一整个服务的worker。   

### 


### egg对cluster的完善   
加入agent守护


主从agent模式下，master承担类类似于进程管理的工作，不进行任何业务代码。（类似于PM2模块中的进程守护模块）  


agent在捕获到异常之后，不应该直接退出，应该打印出错误日志。  


worker因为异常退出的时候，master会重启一个worker进程进行服务。   


IPC 


webworker中能再创建worker吗？
答案是可以的，称之为 subworker，但只有少数浏览器支持，而且意义不是很大  





