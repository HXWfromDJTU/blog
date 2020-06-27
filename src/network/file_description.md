# 文件描述符
课本的知识，需要温故而知新，做个笔记吧

## open_file & file_description
> 在Linux中一切皆可以看成是文件，有`普通文件`、`目录文件`、`链接文件`和`设备文件`。 然而，进程访问文件数据必须要先“打开”这些文件。内核为了跟踪某个进程打开的文件，则用一个个`文件描述符`组成了一个`打开文件表`。

### 文件描述符 (file_description)   

* 文件描述符仅是`打开文件`的标识，是系统内核为了高效管理已经被打开的文件所创建的索引。因为文件系统中`所有的文件数`目与`当前打开`的数目是有数量级差别的。     

  ![](/blog_assets/file_description_set.png)

* 一个`文件描述符`只能够指向一个文件，但是一个文件会有多个`文件描述符`去描述它。 

* 索引一般是小整数，所有执行`I/O`调用的系统操作都需要通过`文件描述符`，文件描述符一般从`3`开始计算 

* 程序刚启动的时候 0指代标准输入,1指代标准输出，2指代标准错误    

* POSIX标准要求,每次打开文件的时候，都必须使用最小的可用序号。下图则是`Linux`中某个进程的文件描述符情况。

  ![](/blog_assets/fd_terminal.png)  

* 文件描述符，既然是描述符，都描述了什么内容呢？
   * ##### 文件指针
        最近的一次读写位置。每个进程分别维护自己的文件指针。      
   * ##### 文件打开计数
        记录当前打开文件的次数。作用是：当文最后一个进程关闭该文件的时候，将其从`打开文件表`中移除。
   * ##### 文件磁盘的位置
        当前进程会将瓷盘中的数据，部分缓存到当前进程所有占有的内存中。
   * ##### 访问权限
        只读、可读、可写，表示当前进程对文件的操作权限。 
   * ##### 文件访问模式  
   * ##### 一个指向该文件锁列表的指针
  
![](/blog_assets/fd_compare.png)

### 打开文件 (open_file)
* 一般来说，系统有多少内存就可以打开多少文件，但是一般系统在底层配置的时候会做出限制，通常是系统内存的10%。      

* 在进程级别上，系统也会限制一个进程能够打开的最大的文件数目，一般这个数目为`1024`，这个限制称之为用户级的限制。        

* 同一个文件可以被一个进程中打开多次，也可以在不同进程中被打开  

* 若是同个进程中，多次打开同个文件，则在i-node表中会是同一个文件。   
* 若是不同进程下的文件描述符，都指向了同一个系统级下的文件句柄，那么很有可能是因为进程非fork造成的。或者是一个进程将UNIX下穿件的文件描述符，传递给另一个进程。 

* 两个不同的文件描述符，若指向同一个打开文件句柄，将共享同一文件偏移量。因此，如果通过其中一个文件描述符来修改文件偏移量，则也会影响当前的文件偏移量。 

* 文件描述符标志（即，close-on-exec）为进程和文件描述符所私有。对这一标志的修改将不会影响同一进程或不同进程中的其他文件描述符  

查看自身机器最大可打开链接数目：
```
$ ulimit -n
```` 

## 文件的 进程视角 与 系统视角

#### 进程视角   
* 读写操作都是以`数据块`为单位进行的。
* 用户访问系统文件的访问模式: 
   * ##### 顺序访问
      * 大多数文件的访问都是顺序访问
   * ##### 随机访问
      * 从中间开始读取，不常用但是也十分重要。例如，虚拟内存中把内存也存储在文件中。
   * ##### 索引访问
      * 依据数据特征进行索引,用以提高读写效率。   
      * 通常操作系统是不直接提供索引访问的。
      * 一般通过数据库应用进行索引访问。
      ![](/blog_assets/fd_index.png)

#### 系统视图
* 文件内容都是`字节序列`。     
* OS 不关心存储在磁盘上的数据结构。           
* OS 认为文件是数据块的集合，数据块是逻辑的存储单元，而扇区是物理的存储单元。      

## 文件内部结构
* ##### 无结构
  * 单词字节序列   
* ##### 简单记录结构
  * 分列
  * 固定长度
  * 可变长度  
* ##### 复杂结构
  * 格式复杂的文档(如 MS Word, PDF)
  * 可执行文件

## 语义一致性
> 语义一致性，规定了多进程如何同时访问共享文件。又因为磁盘I/O和网络延迟的原因，而把这部分设计得比较宽松。基本都把数据一致性的问题，抛给了应用程序自己去解决。      
* ##### UNIX(举例)
  * 对打开文件的写入内容，对于另外一个打开同一文件的用户可见。
  * 共享文件指针，允许多用户同时读取、写入文件。
  * 写入的内容只有当文件关闭的时候，另一个进程才可见。
  * 操作系统级别，原生提供几种读写锁给应用程序进行调用，用于实现数据一致性的问题。     

## 参考资料
[1] [清华大学操作系统课程 - 文件描述符 - youtube](https://www.youtube.com/watch?v=H4AZXHkzPRM)