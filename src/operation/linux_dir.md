# linux目录简介
以下图片来自博主自己的一个云服务器(centOS)

### "/"根目录
![](/blog_assets/linux_root_dir.png)
___
### /bin目录 (指令库）
提供所有用户使用的完成基本维护任务的命令，进入该文件夹，里面可以见到我们常用的很多命令,比如`curl`、`grep`、`cat`、`chmod`、`vi`等
![](/blog_assets/linux_bin_dir.png)
___
### /sbin (超级管理员的指令库)
超级用户可以使用的执行文件，里面多是系统管理命令，例如`ifconfig`、`iptables`等
![](/blog_assets/linux_sbin_dir_1.png)

那我们继续打开`/usr`下的`/sbin`
![](/blog_assets/linux_usr_sbin_1.png)
___

### /etc目录
系统和应用软件的配置文件所在的目录，比如说`bashrc`、`passwd`等。
![](/blog_assets/linux_etc_dir.png)

___
### /lib (共享的系统模块)
系统最基本的共享链接库和内核模块,例如`libc-2.17.so`
![](/blog_assets/linux_lib_dir.png)

___
### /tmp 
存储临时文件的目录,博主的云服务器`tmp`目录中目前只有一个存放(服务器公钥?)的文件   
![](/blog_assets/linux_tmp_dir.png)

___
### /proc
该目录中挂载了一个虚拟文件系统，用找`虚拟文件`的形式，映射系统与进程在内存中的运行时信息。   
![](/blog_assets/linux_proc_dir.png)

比如`/proc/cpuinfo`文件，使用`vi`打开预览，结果如如下   
![](/blog_assets/linux_proc_cpuinfo.png)

而`/proc/version`文件，则存记载系统相关的版本号信息   
![](/blog_assets/linux_proc_version.png)  

##### 进程信息
也许你也好奇，为啥这个目录下会有这么多以数字命名的文件夹。刚才说这个目录下，会记录一下当前系统运行的一下信息，有些同学相信已经猜到啦，这些`数字`就是`进程id` `(<pid>)`

![](/blog_assets/linux_proc_pid.png)  

___
### home目录  
普通用户的家目录


### /usr 
这个目录的结构与根目录极为相似，但是根目录中的文件，多是系统级别的文件，而`/usr`目录中是用户级的文件，一般与具体的系统无关   
![](/blog_assets/linux_usr_dir.png)

