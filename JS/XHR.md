# HXR对象

### 手写XHR
```js
let xhr = new XMLHTTPRequest();

xhr.onreadystatechange = _=>{
    if(xhr.readystate==4){
        if(xhr.state==200){
            console.log(xhr);
        }
    }
}

xhr.open('GET','/api',flase);

xhr.send(null);

```
![](/blog_assets/xhr_devetool.png)


❤️ 0 表示代理被创建   
❤️ 1 表示 open()方法已经被调用  
❤️ 2 表示 send()方法已经被调用，并且头部状态已经可以获得  
❤️ 3 表示下载中，responseText 已经包含了部分数据  
❤️ 4 表示下载操作已经完成   