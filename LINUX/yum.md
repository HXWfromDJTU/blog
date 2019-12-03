# yum 工具
全称是 Yellow dog Updater Modifier，是一个在 Fedora 和 RedHat 以及 CentOS 中的shell前端软件包管理器。

* 基于RPM包管理
* 可以自动处理包与包之间的依赖关系，并且一次安装所有依赖的软件包，无需一次次的下载与安装。

### 常用命令
```shell
# 安装命令
yum install nginx-3.0.1.rpm

# 删除软件
yum remove nginx-3.0.1.rpm
yum erase nginx-3.0.1.rpm

# 升级软件
yum upgrade nginx
yum update nginx

# 查询源信息
yum info nginx

# 搜索软件
yum search nginx

# 显示依赖关系
yum deplist nginx
```

### 图形界面版本
`yum`拥有`yumex` 与 `kyum` 两种，两款软件都是`yum`的图形界面版本，背后仍然需要依赖`yum`。

