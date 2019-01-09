# MessageChannel


### 简介
1️⃣ 架设一个“秘密隧道”，隧道有两个出口，分别为port1和port2。
2️⃣ 拥有两各端口句柄的用户，可以使用port句柄向对方发送消息。  


### 场景 
1️⃣ 比较有优势的地方就是在多个 `web worker`之间进行通信，而父窗口负责创建`messageChannel`对象，再通过`postMessage`的形式将`messageChannel`实例上的`port1`和`port2`传递给不同的`web worker`，从而达到`web worker`之间可以直接进行通信。   


