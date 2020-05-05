# 最常见问题  

> 如何实现水平居中?

##### inline元素 
```css
   item{
       text-align:center;
   }
```

##### block元素 
```css
.container{
    
}
.item{
    margin:0 auto;
    width:300px;
}
```

##### 已知容器宽度
```css
/* 使用绝对定位 */
.container {
    position:relative;
    width:300px;
}
.item{
    position:absolute;
    left:50%;
}
```


> 如何实现垂直居中  

##### inline元素 
```css
.container{
    height:500px;
    line-height:500px; /*只有一行元素哦 */
}
```


##### block元素 （必须已知高度，绝对定位）
```css
.container{
  position: relative;
    height: 300px;
 } 
.item{
    width: 100px;
    height: 50px;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
}
```