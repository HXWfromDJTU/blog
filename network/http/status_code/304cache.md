## 协商缓存 与 强缓存
___
### 缓存过程
浏览器缓存能够极大地改善网页的性能，提高用户体验。

浏览器在请求某个资源的时候，会先获取该缓存的`header`信息，判断是否命中强缓存(`cache-control`和`expire`信息)。

若命中直接从缓存中获取信息资源，包括缓存的`header`信息，本次请求根本不会与服务器进行通信。

若没有命中强缓存，浏览器则会发送请求到服务器，请求会携带第一次请求返回的有关缓存的`header`字段信息(`Last-Modifiled`/`If-Modify-Since`和`Etag/If-None-Match`)，由服务器根据请求头中的相关`header`信息来比对是否命中协商缓存。若命中则服务器返回新的响应`header`信息更新缓存信息中对应的`header`信息，但是并不返回资源内容，他会告诉浏览器可以直接从缓存中获取。若没有命中协商缓存，则服务器直接返回最新的资源内容。
___
### 强缓存
  :arrow_right: 直接从缓存取`header`和信息`body` :arrow_right:  状态码 `200` :arrow_right: 直接从缓存取
###### expire
字面意思是过期时间，其值是一个绝对时间的GMT格式的时间字符串，如`Fri 5 Oct 2018 22:16:15 GMT`如果发送请求的时间在`expire`之前，那么本地缓存的内容始终有效，否则就会发送请求到服务器
###### cache-control
* 值若是 `max-age=number` 则，表示距离第一次请求这个资源的时间，一定时间段内(max-age内)可以直接命中本地缓存。
* 若值是`no-cache` 则表示需要进行协商缓存，先与服务器确认返回的响应是否被更改过(这里通过`Etag`来实现)。若资源未被更新，则可以避免重新下载。
* 若为`no-store`则是表示禁用浏览器的缓存，每次都向服务器发送一个请求，每次都会下载完整的资源。
* `public`则表示可以被所有的用户缓存，不允许CDN等中级缓存服务器对资源进行缓存。
* `private` 则表示只能够呗终端的用户浏览器缓存，不允许CDN等中级缓存服务器对其缓存。
##### 如何在expire内解除强缓存
改变资源的`URL`地址，比如\
从
`<link rel="stylesheet" href="a.css">`
改为
`<link rel="stylesheet" href="a.css?v1.3.2">`
### 协商缓存
  :arrow_right: 从缓存取 :arrow_right: 状态码 `304` :arrow_right: 会发送请求到服务器，通过服务器来告知缓存是否可用

###### Last-Modified/If-Modified-Since
这两者的值都是`GMT`格式的时间字符串

浏览器第一次跟服务器请求一个资源，服务器再返回这个资源的同时，在`Response-header`中加上`Last-Modified`的值，表示这个资源在服务器上的最后修改时间。

服务器再次受到资源请求的时候，根据`浏览器`传过来的`IF-Modified-Since`和资源在服务器上的最后修改时间判断是否有变化，若果没有变化，则返回`304 NOT MODIFIED`，返回数据包中不含有返回的`body`，并且返回`header`中不再包含`Last-Modified`，因为既然资源没有发生变化，那么`Last-Modified`也就不会改变。

若浏览器收到服务器304的响应后，就会从缓存中加载资源。

若果协商缓存没有命中，浏览器直接从服务器加载资源时，`Last-Modified`的`Header`在重新加载`的时候会被更新，下次请求时，`If-Modified-Since`会启用上次返回的`Last-Modified`值
  【client】:arrow_right:【server】___:arrow_right:Last-Modified___【client】___:arrow_right:If-Modified-Since___【server】


###### Eatg/If-None-Match
这两个值是服务器生成每个资源的唯一标识符号，只要资源有变化，这个值就会改变。
其判断过程与`Last-Modfied/If-Modified-Since`类似，与`Last-Modified`不一样的是，当服务器返回`304 Not Modified`的响应时，由于`ETag`重新生成过，`response header`中还会把这个`ETag`返回，即使这个`ETag`跟之前没有变化。也就是说只要请求经过了服务器，那么`ETag`则一定会改变。
  【client】:arrow_right:【server】___:arrow_right:Etag___【client】___:arrow_right:If-None-Match___【server】

#### 有了Last-Modified为何还需要ETag呢？
###### ① Http1.0 下 Last-Modified的缺点
* 使用`Last-Modified`只能够检测到秒级的差别，若文件修改得十分频繁，在秒级内多次修改，这样使用`Last-Modified`则会丢失掉一些文件的版本。
* 一些文件也许只是会周期性的修改，而其内容并没有发生变化，这个时候我们并不希望客户端认为这个文件被修改了。
* 总结以上两点就是，用文件的传输时间去定义文件的版本，以表明是否需要更新文件，是不够科学的。
* 更有甚者，某些服务器并不能够精确地得到文件最后的修改时间。

###### ② http1.1下Etag的优势
* `Etag`是服务器自动生成或者有开发者生成的对应资源在服务器的唯一标志符，控制缓存更加精准
* `Last-Modified`与`ETag`是可以一起使用的，服务器会优先验证`ETag`，一致的情况下，才回继续比较`Last-Modified`，最后才决定是否返回`304`
___
### 用户操作对浏览器缓存的影响

`地址栏回车`、`页面链接跳转`、`新打开Tab` 、`前进后退` 
 :arrow_down: 
 强缓存、协商缓存都有效

 使用`F5刷新页面` :arrow_right: `Expire/Cache-Control`无效，`Last-Modified/ETag`有效

 使用`Ctrl + F5强制刷新` :arrow_right:  强缓存、协商缓存都无效

___
### 参考文章
[强缓存 VS 协商缓存 - 掘金](https://juejin.im/entry/5a717235518825732739ec46)












