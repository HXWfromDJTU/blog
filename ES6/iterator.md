### iterator 遍历器

Iterator接口的目的，就是为了所有数据结构，提供了一种访问机制，也就是`for...of`循环，详见下文，当使用`for...of`的时候，循环会自动寻找Iterator接口。
   
```js
const obj = {
    [Symbol.iterator]:function(){
        return {
            next:function(){
                return {  
                    value:1,
                    done:true
                }
            }
        }
    }
}
```

### 调用 iterator 接口的地方
1⃣️ 结构赋值

2⃣️ 扩展运算符

3⃣️ yield * 后面

4⃣️ 字符串的 Iteraytor 接口
![](/blog_assets/iterator_str.png)

5⃣️ 数组的 Iterator 接口
![](/blog_assets/iterator_array.png)

`for...of`遍历数组和字符串也就是调用对象的 Symbol.iterator 
![](/blog_assets/iterator_compare.png)

6⃣️ Set和Map的Iterator接口
```js



```

7⃣️ 所有以可以接受数组作为参数的场合，都会调用遍历器接口
例如：
```js
for...of   //遍历数组
Array.form()   // 数组转换
M

```



