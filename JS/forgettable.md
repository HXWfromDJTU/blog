# 经常忘记
### 单行文字溢出省略
```css
.overflow{
    overflow:hidden;
    text-overflow:ellipis;
    white-sapce:nowrap;
}
```
### 多行文本省略(仅在-webkit内核中有效)
* 一般用于移动端浏览器
```css
.voerflow{
    overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
```

### 使用get/set可以定义使用" . "操作符的操作
```js
function counter_get (n){
    return {
        get counte(){
        return ++n;
        },
        set counte(m){
            if(m<n){ throw Error("error: param less than value"); }
            else {
                n = m; return n;
            }
        }
    }    
 }
```