## 前言
在了解`Node.js`内存的分配的时候，堆外内存是一个神秘的存在，仅知道它是通过`Node.js`中的`C++`代码向内存申请使用的。这其中最具代表的必须要数`Node.js`中的`Buffer`和`Stream`了。

`Buffer`字面的意义是缓冲区，暂存器，了解过`操作系统组成原理`的同学一定不会陌生。在计算机中，缓冲器是存储变量，方便CPU直接读取的一款`存储区域`。而`Stream`则是类比数据字节的顺序的移动像是水流一样。

## Buffer
作为前端工程师，在进阶学习`Node.js`时遇到`Buffer`常常比较陌生，因为虽然同是`Javascript`，但在浏览器场景下处理文件流、视频流是相对比较少的情况，而服务端`Javascript`的情况恰恰相反。

> Buffer 对象用于表示固定长度的字节序列。 --- 《Node.js文档》

> Buffer是一个像Array的对象，但它主要用于操作字节。 --- 《深入浅出Node.js》

### Buffer与数组、字符串的关系
* `Buffer`类似于数组，可以使用下标访问，并且有`length`属性。
* 大小在创建时就固定，且无法调整。
* `Buffer`每一个元素都是一个`两位的十六进制数`。
    ```js
    const buff = Buffer.from('swain wong')
    console.log(buff) // <Buffer 73 77 61 69 6e 20 77 6f 6e 67>
    ```
* `Buffer`可以和`String`进行相互转换，并且可以指定`字符集编码`。
* `Buffer`格式的内容更便于在网络中传输，而`String`形式的内容更便于进行修改操作。
 
### 内存分配
> Buffer 是一个典型的Javascript 与 C++ 结合的模块，它将性能相关部分用 C++ 实现，将非心梗相关部分用`Javascript`实现。   --- 《Node.js 深入浅出》

![](/blog_assets/nodejs_buffer_memory.png)

* `Buffer`所占的内存并不受`V8`所支配，属于堆外内存，但包含在`RSS`之内。
* 内核用`8 KB`来界定`大对象`和`小对象`
  * 小对象直接使用内存池中的内存。
  * 大对象直接使用C++层面申请的内存进行载入。
 

## Stream
> 流（stream）是 Node.js 中处理流式数据的抽象接口。 stream 模块用于构建实现了流接口的对象。  --- 《Node.js官网文档》

![](/blog_assets/node_stream_buffer_relate.png)

数据的流动就像是生活中水的流动褨，流是可以描述所有常见`输入-输出`类型数据的统一模型。就像是水流有方向，数据的排列也有方向性一样，数据流本身也具有方向性，对于某一端可写，对于另一端边仅仅可读了。
### 四种基本 Stream
| 流种类 | 具体实现 |
| --- | --- |
| Writable Stream | `HTTP Request(client)` `HTTP Response(server)` `fs write stream`|
| Readable Stream |  `HTTP Response(server)` `HTTP Request(client)` `fs read stream`|
| `Duplex` 既可读又可写的流 | `TCP Sockets` `zlib streams`  `crypto streams`|
| `Treansform` 在读写过程中即可以修改或者转换数据的`Duplex`流 | `zlib streams` `crypto streams` |

### 与EventEmitter的关系
在`Node.js`的API设计中，`Stream`被设计为事件驱动相关的，继承实现了`EventEmitter`。四种基本的`Stream`都包含有`close`、`error`、`data`、`finish`的接口用于流数据的读取。

## fs
> fs 模块可用于与文件系统进行交互（以类似于标准 POSIX 函数的方式）。   --- 《Node.js官方文档》

不难看出，从`Buffer`到`Stream`再到`fs`模块，对数据处理的粒度是越来越大的。而`Node.js`在`fs`模块的实现上确实也是继承了上述两个模块的`api`来实现的。
* 继承`Stream`的文件流，对外暴露`fs.createReadStream`与`fs.createWriteStream`
* 对文件的同步与异步操作
  * `fs.readFileSync`与`fs.writeFileSync`
  * `fs.readFile`与`fs.writeFile`
* 以上两种`fs`处理文件的形式，区别在于第一种的处理会将文件处理为流的形式。第二种会将文件视作一个整体，统一为整个文件分配内存大小，并将内容放入到一个大的缓冲区中。

## 小结
`Buffer`、`Stream`与`file`在后端中是很成熟的概念，且不说`Node.js`在服务端处理文件流的底层逻辑，仅`Node.js`作为前端工具链对前端文件进行`打包`的时候，最基础的步骤就是：`读取文件内容`  ==> `处理文件内容`  ==> `生成处理后的内容`。了解`Buffer`、`Stream`与`fs`对我们理解很多前端自动化工具打下了坚实的基础。

## 参考资料
[1] [认识node核心模块--从Buffer、Stream到fs](https://segmentfault.com/a/1190000011968267)    
[2] [Node.js v14.13.1 文档 - fs文件系统](http://nodejs.cn/api/fs.html#fs_file_system)   
[3] [Introduction to NodeJS Streams](https://codemacaw.com/2019/11/29/introduction-of-nodejs-streams/)
