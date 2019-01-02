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