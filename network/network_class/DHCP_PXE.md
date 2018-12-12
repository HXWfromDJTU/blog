#### DHCP

1️⃣ 动态主机配置协议
2️⃣ DHCP discover 过程指的是一个新的设备来到了一个新的网络环境中，这个设备向DHCP server发出请求，申请一个IP地址
3️⃣ DHCP offer: DHCP server处理新人的请求，并分配一个ip地址给新人，最后将ip信息发回给新人（注意，此处新人可能收到多个DHCP server分配的内容）
4️⃣ DHCP request ： 新人收到了DHCP发来的租约，就向网络发送一个网络包，包含ip租约的大致情况（利用这个方法通知了其他DHCP服务器，他已经找到ip了，谢谢你们的offer）
5️⃣ DHCP server 会广播返回一个 DHCP ACK给暴扣申请者在内的网段中的所有机器
6️⃣ DHCP分配的地址租约是有时间限制的,超过时限之后，“新人”会再向DHCP服务器发送一个 `DHCP REQUEST`,然后DHCP SERVER也会再回复一个未被占用的地址。

#### PXE
PXE (Pre-boot Excution Environment)
1️⃣ PXE客户端相当于一个新来的简单的机器，刚进入网的时候，会向DHCP server请求分配ip
2️⃣ DHCP server给PXE发送一个ip和一个pxelinux.0配置文件
3️⃣ PXE客户端就从这个ip上下载所需要的文件，下载后就执行这个文件，然后又向TFTP server发送请求，请求操作系统内核
3️⃣ 拿到内核就好办了，我们就开始安装Linux系统