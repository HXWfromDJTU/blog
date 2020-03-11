### 1️⃣ 判断一个单词是否是回文？

很多人拿到这样的题目非常容易想到用for 将字符串颠倒字母顺序然后匹配就行了。其实重要的考察的就是对于reverse的实现。其实我们可以利用现成的函数，将字符串转换成数组，这个思路很重要，我们可以拥有更多的自由度去进行字符串的一些操作。
```js
function checkPalindrom(str) {  
    return str == str.split('').reverse().join('');
}
```



### 2️⃣ 数组去重
```js
arr = [...new Set(arr)];   
```


### 3️⃣ 格式化cookie为JSON
```js
// 格式化cookie函数
function parseCookie() { 
    var cookie = document.cookie;
    var pattern = /([^=]+)=([^;]+);?\s*/g;
    var result, value = {}; 
    while((result = pattern.exec(cookie)) != null) {
         value[result[1]] = result[2]; 
         } return value; 
   }
```


