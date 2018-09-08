## babel编译原理
___
主要过程：解析--转换--生成
![babel_AST](../BLOG_ASSETS/babel_AST.png)


### 解析 (parse)
`babel`使用`babylon`解析器，根据输入的`javascript`代码，根据`ESTree`规范生成`AST`

### 转换 (transform)
根据约定的要求规则，对`AST`进行修改。
这个过程中，`babel-core`接收一个插件数组`transformer(plugin)`，依次使用插件数组中的各种转换规则，对`AST`树进行转换。
```js
babel.transform(code, {
    plugins: [
        arrayPlugin
    ]
})
```

### 生成 (generate)
使用`babel-generator`，深度优先遍历整个 AST，根据修改后的`AST`生成JS代码

##### AST (抽象语法树)
就像我们熟读JS语法规则之后，看到JS代码能够明白代码执行的作用。
那么`AST`就是语言内核能够理解的`文字`，解析器会使用各种分割符号，对`AST`进行分割。


`AST`转换体验,[摸我](astexplorer.net/)
这个过程其实和`Virtual Dom`去存储DOM信息一样，使用json对象取存代码的信息。然后js内核再去解析这个`json`对象。
![](../blog_assets/AST_transformer1.png)
![](../blog_assets/AST_transformer2.png)

相同作用的代码，使用`ES5`和`ES6`，那么转换的过程就是将后一种结果，转换成前一种结果。

___
## 常见的配置
配置都是在`.babelrc`中进行配置
#### plugin 
支持开发者详细使用哪些插件，先后顺序。支持直接书写插件模块名，也支持书写插件包路径。
```js
{
plugins: [
    'transform-class-properties',
    'es2015-arrow-functions',
    'transform-decorators-legacy'
    ]
}
```
[官方插件列表](https://www.babeljs.cn/docs/plugins/)
![](../blog_assets/babel_plugin.png)

#### preset 
不想定制你自己的插件? 没关系! `Presets` 是可共享的`.babelrc` 配置或者只是一个 `babel` 插件的数组。
`Babel`团队将`ES2015`的很多个`transform plugin`集成到`babel-preset-es2015`，所以你这需要引入`es2015`
```js
{
  "presets": [ "es2015" ]
}
```

#### stage-x
`stage-x`表示语言每一个大版本变化中的的不同阶段
* `Stage 0` - 稻草人: 只是一个想法，可能是 babel 插件。
*   `Stage 1` - 提案: 初步尝试。
*  `Stage 2` - 初稿: 完成初步规范。
 -----   推荐 使用 `stage 3`  之后的版本 ------
*  `Stage 3`- 候选: 完成规范和浏览器初步实现。
*   `Stage 4` - 完成: 将被添加到下一年度发布。

### Plugin/Preset 执行排序
* Plugin 优先于 Preset 执行。
* Plugin 的数组中，按正序执行。
* Preset 的顺序是按照数组的逆向顺序执行。

___

### 常见配置
`babel6`以后的版本，`babel`就不在意一个全家桶的形式存在，而是只默认安装一些核心转换器，另外的插件需要按需去手动安装。
#### babel-cli
`babel-cli`是一个通过命令行对`js`文件进行转码的工具。
#### babel-core
包含了babel的一些核心流程
* `babel.transform`: 用于转换字符串到`AST`
* `babel.transformFile`: 异步文件转码方式
* `babel.transformFileSync`: 同步文件转码
* `babel.transformFormAst`: 使将`AST`转码为正常代码(这里的AST已经通过了各种指定插件的修改)
#### 全部全局引入垫片 babel-polyfill
`polyfill`意思是垫片，多数的插件是将`es6/7/8`转换为`es5/3`。但有些语法在`ES5/3`语法中尚未被支持，所以要使用一些内置的函数去实现这些新功能。
* 优点
`babel-polyfill`可以几乎可以保证我们使用所有的ES6+的语法，因为该插件会附带引入所有的垫片插件。
* 缺点
   * 使用最安全但体积也最大。
   * 会污染全局变量。像Map，Array.prototype.find这些就存在于全局空间中
  
#### 按需引入的 babel-transform-runtime
* 优点
 `transform-runtime`的功能是按需引入`polyfill`，不需要再使用一个个去设置`polyfill`的`plugin`(麻烦),也不需要使用`babel-polyfill`引入全局的所有的转换插件。
* 缺点
   它不模拟实例方法，即内置对象原型上的方法，所以类似`Array.prototype.find`，你通过`babel-runtime`是无法使用的，这只能通过 `babel-polyfill` 来转码，因为 `babel-polyfill` 是直接在原型链上增加方法(又绕回去的感觉)。
* 建议
建议使用`transform-runtime`去开发一些框架或者类库(如`element-ui`)，而在开发web应用的时候，建议使用完整的`babel-polyfill`进行开发，避免出现错误。
```js
// vue-cli 工具下的默认 .babelrc 配置
{
  "presets": ["es2015", "stage-2"],
  "plugins": ["transform-runtime"],
  "comments": false,
}
```
#### 根据使用环境配置 babel-preset-env 
`babel-preset-env`是`babel`团队开发的，一种优化细化babel编译的设置插件，用户可以根据具体的使用环境，比如浏览器（`IE8`+,`firefox 36`+,`chrome 49+`），`node`环境`@8.9.4`。
例如：
```js
{
  "presets": [
    ["env", {
      "targets": {
        "browsers": [ "ie >= 8", "chrome >= 49","firefox >=49" ],
        "node":"8.9.4"
      }      
    }]
  ]
}
```
* `babel-preset-env`详细配置，[传送门>>>](https://www.babeljs.cn/docs/plugins/preset-env/#%E9%80%89%E9%A1%B9)

细致的环境配置，可以极大减少一些不必要的`polyfill`垫片的引入，在保证安全的情况下，也最大的减小的引入包的大小。
___
#### 参考文章
[babel官方手册](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/user-handbook.md)
___
接下来我们接着看看怎么去开发一个`babel-plugin`吧，[传送门>>>](./babel_plugin_dev.md)

