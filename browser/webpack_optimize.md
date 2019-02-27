# 前端性能优化系列 - 之 webpack打包优化
![](/blog_assets/webpack_optimize.png)

### 定位体积大的模块  
使用`webpack-bundle-analyzer`插件进行分析。我们知道了各个包大小关系，才能够更有效的布置以下的优化配置。     

![](/blog_assets/webpack-bundle-analyzer.png)     
___
### 排除打包（external ）
当我们看到有些依赖库特别大的时候，我们不打算对其进行打包操作，而决定使用CDN的形式进行引入，这时候我们就需要用到`external`配置项。          
1️⃣ 在HTML文档中使用script标签进行资源引入。     
2️⃣ 在webpack中配置externals进行排除打包操作。     
```js
externals{
    jquery:"jQuery"
}
``` 
3️⃣ 在项目中引入使用 
```js
const $ = require('jquery');
$('#content').text('123')
```
___
### 代码分割（code-spliting）
代码分割是webpack的天然职责，为什么这么说呢，因为webpack官网冷冷的丢下一句话叫做`webpack--a module bundler`,这正是它区别于`gulp`和`grunt`的设计定位，重点在`分割模块`。而这一个功能，并不需要我们去显示地配置，而是我们在业务代码中细微处决定这一个个模块是否要被`懒加载/异步加载`进来。       

模块分割，也就是我们要在业务代码引入模块的时候，书写一些webpack能够是识别的方法去代替我们传统的引入方式，让webpack对他们进行特殊处理。     
##### webapck内置方法     
这个在之前的文章（[《Javascript模块化大全》](/project_build/js_modules.md)中的webpack部分）已经有提过，在这里我们复习一下。官方文档[传送门👉](https://www.html.cn/doc/webpack2/guides/code-splitting-require/)
```js     
/**
 * @param <Array>  表明依赖的模块，这些依赖都会提前加载        
 * @param <Function>  在函数中出现的 require引入的模块，不会和主文件打包在一起     
 * @param <String>  表示单独打包生成的模块名称     
**/
require.ensure([],()=>{
    var moduleA = require('./modileA'); // 会马上执行内部的内容
},'moduleA') 
require.ensure([],()=>{
    require.include('./moduleA');     // 仅仅是加载，但是不执行       
},'moduleA') 
```       
##### 使用import
尝试引入一个模块，模块返回的是一个promise对象。     
```js
import('./moduleA').then(moduleA=>{
      console.log(moduleA);
});
```     
##### 使用require(CMD) 
webpack也支持CMD规范，使用CMD规范可以实现模块懒加载
```js
require(['./list'],list=>{
    list.show();
})
```
___

### 使用缓存([hash])
我们在前端优化的知识点中，有一点很重要的就是使用本地的缓存进行减少请求，以达到优化的效果。     
我们在给打包资源设置输出名称的时候，注意到有`[name]`、`[contenthash]`、`[hash]`、`[chunkhash]`等设置。     

|配置项|含义|备注|
|---|---|---|
|[name]| 原始文件名的替代符 |   |
|[contenthash]| 表示你由文件内容产生的hash值，内容不同，产生的contenthash值也不一致|   |
|[hash]|hash值是跟整个webpack构建项目有关的，每一次打包的时候都会更新，即使项目文件没有做任何修改|  基本处于强制不缓存 |
|[chunkhash]|webpack打包根据entry配置，会生成多个chunk，并且对应生成不同的hash值，一般在项目中，把公共依赖库和程序的入口文件隔离，来实现单独打包构建。用chunkHash来生成一个hash，若依赖库不变，则对应的chunkhash就不会变，从而达到文件缓存的效果。|   |        

##### chunkHash 用于缓存依赖库 
```js
module.exports = {
    entry:{
        app:'./src/main.js',
        vendor:['react','redux','react-dom','react-redux']
    },
    output:{
        path:path.join(__dirname,'/dist/js'),
        filename:'[name].[chunkhash].js' // 在配置输出名字的时候，混入[chunkhash]
    }
}
```
##### contenthash 用于 经常变化的css/JS  
```js
output:{
    path:path.resolve(___dirname,'../dist'),
    filename:'static/js/[name].[contenthash:8].js',
    publicPath:'/'
}
```   
```js   
new MiniCssExtractPlugin({
    filename:'static/css/[name].[contenthash:8].css'
})
```  
##### 图片字体缓存 
下面👇是常见的图片/字体配置，通常使用的是`file-loader`来完成的，配置项中的`[hash]`也是由文件的内容而计算出来的，可以理解为上面👆提到的`[contenthash]`，和webpack打包时的`[hash]`并不是同一个，所以不要混淆。           
```js
module.exports = {
 ...
 rules: [
   ...
    {
      test: /\.(gif|png|jpe?g)(\?\S*)?$/,
      loader: require.resolve('url-loader'),
      options: {
        limit: 10000,
        name: path.posix.join('static',  '[name]_[hash:7].[ext]')
      }
    },
    font: {
      test: /\.otf|ttf|woff2?|eot(\?\S*)?$/,
      loader: require.resolve('url-loader'),
      options: {
        limit: 10000,
        name: path.posix.join('static', '[name]_[hash:7].[ext]')
      }
    }
 ]
}
```
___
### 抽离共同依赖(commonChunk / splitChunksPlugin)      
若我们一个业务A中引用了一个依赖C，因业务B中也引用了同一个依赖C，那么当我们打包的时候就希望将依赖C进行一个抽取公共，而不是将C打包进两个不同的业务中去，最终重复引用导致输出过大。这时候我们使用`webpack-optimize.CommonChunkPlugin`进行共同模块的抽取。       
##### `webpack.base.conf.js`
```js
module.exports = {
    entry:{
        service:'./service1.js',   // 业务模块1
        service2:'./service2.js',  // 业务模块2
        lodash:['lodash'],         // 依赖1
        vue:['vue','vuex']         // 依赖2，3
    },
    output:{
        path:__dirname+'/dist',
        filename:'[name].[chunkhash:8].js'
    },
    plugins:[
        new CommonChunkPlugin({
            name:['common','loadsh','vue'] // 注意要先配置合并的出口，再去配置插件类的合并        
        })
    ]
}
```
这一步的核心是要将重复的依赖，从各个模块中抽取出来，减小打包模块的总大小。但要注意，这样的打包每一次都会发生，包括我们日常的`dev`操作。    
webpack4中已经废弃了以上的做法，改为使用`splitChunksPlugin` && `runtimeChunkPlugin`  
官方配置文档，[传送门👉](https://webpack.docschina.org/plugins/split-chunks-plugin/#src/components/Sidebar/Sidebar.jsx)
```js
webpackConf: {
    ...,
    output: {
        path: path.join(process.cwd(), 'dist'),
        publicPath,
        filename: '[name].js',
        chunkFilename: '[name].js'
    },
    optimization: {
        splitChunks: {
            chunks: 'initial', // 只对入口文件处理
            cacheGroups: {
                vendor: { // split `node_modules`目录下被打包的代码到 `page/vendor.js && .css` 没找到可打包文件的话，则没有。css需要依赖 `ExtractTextPlugin`
                    test: /node_modules\//,
                    name: 'page/vendor',
                    priority: 10,
                    enforce: true
                },
                commons: { // split `common`和`components`目录下被打包的代码到`page/commons.js && .css`
                    test: /common\/|components\//,
                    name: 'page/commons',
                    priority: 10,
                    enforce: true
                }
            }
        },
        runtimeChunk: {
            name: 'page/manifest'
        }
    },
     plugins: [
        new ExtractTextPlugin({
            filename: '[name].css',
            ignoreOrder: true
        }),
        ...
    ]
    ...
}
```
___
### 部分打包（ DllPulgin 和 DllReferencePlugin ）  🤣 
因为我们日常的开发是在业务开发，通用库的开发甚至是项目的依赖方面大部分时间中，我们是不会去触动的。     DllPlugin需要一个单独的配置文件，因为我们一般会单独去执行它打包，比如我们要更新这些依赖库的时候才去打包。      

注意本次介绍的方法是基于`webpack 3.x`进行配置的。
##### `webpack.dll.conf.js`
```js
module.exports = {
    entry:{
        vendor:dependcies
    },
    output:{
        path:path.join(__dirname,'../static'), // 配置打包后输出的目录
        filename:'dll.[name]_[hash:8].js', //配置输出的文件名
        library:'[name]_[hash:8]'
    },
    plugins:[
        // 使用 DLL配置,将静态资源
        new webpack.DllPlugin({
            path:path.join(__dirname,'../','[name]-mainfest.json'),
            name:'[name]_[hash:8]'
        }),
        // 将产生的带着hash的bundle.js配置，输出到一个静态文件中，以备后续打包所读取(htmlWebpackPlugin)
        new AssetsPlugin({
            filename:'bundle-config.josn',
            path:'./'
        })
    ]
}
```   
配置好以上信息之后，我们执行一下命令，进行静态依赖的打包。
```bat
webapck build/webapck.dll.conf.js  
```
从而得到`bundle-config.json`和`vendor-manifest.json`两个记录性的文件，接下来我们看看这两个文件的大概内容。
##### `bundle-config.json`  
这个文件是记录着这个单独打包出来的依赖输出的路径信息和带着哈希的文件名。            
```json
{"vendor":{"js":"dll.vendor_301599.js"}}
```
##### `vendor-manifest.json`  
这个文件是`webpack.DllPlugin`插件分离静态资源的情况的输出文件，记录了各个”被分离”的资源的情况，主要给后续打包的`DllReferencePlugin`配置项所使用。         
```json   
{
    "name": "vendor_301599",
    "content": {
        "./node_modules/_vue@2.6.7@vue/dist/vue.runtime.esm.js": {
            "id": 30,
            "meta": {
                "harmonyModule": true
            },
            "exports": [
                "default"
            ]
        },
        "./node_modules/_timers-browserify@2.0.10@timers-browserify/main.js": {
            "id": 31,
            "meta": {}
        },
        "./node_modules/_setimmediate@1.0.5@setimmediate/setImmediate.js": {
            "id": 32,
            "meta": {}
        },
        "./node_modules/_vue-router@3.0.2@vue-router/dist/vue-router.esm.js": {
            "id": 33,
            "meta": {
                "harmonyModule": true
            },
            "exports": [
                "default"
            ]
        },
        "./node_modules/_vuex@3.1.0@vuex/dist/vuex.esm.js": {
            "id": 34,
            "meta": {
                "harmonyModule": true
            },
            "exports": [
                "default",
                "Store",
                "install",
                "mapState",
                "mapMutations",
                "mapGetters",
                "mapActions",
                "createNamespacedHelpers"
            ]
        }
    }
}
```
以上是一轮打包，也就是我们在更新“依赖库”的时候，需要进行的打包。下面👇 我们接着介绍业务代码的日常打包时，对于这些“静态依赖”该如何配置处理。      
##### `webpack.base.conf.js`
```js
// 引入项目分包情况，在日常业务打包的时候，要将“依赖库“分离开来......不要将“依赖库”也打包进去
const manifest = require('../vendor-manifest.json')
module.exports = {
    // 其他配置....
    plugins: [
    // 关联dll拆分出去的依赖
    new webpack.DllReferencePlugin({
      manifest
    })
  ]
}
```
##### `webapck.prod.conf.js` 或者 `webapck.dev.conf.js`     
```js
// 引入bundle-config.jsond的配置项，目的是找到分离出去的依赖库打包后的资源路径      
var bundleConfig = require("../bundle-config.json");
module.exports = {
    //...... 其他的配置
    plugins:[
        new HtmlWebpackPlugin({
          filename: config.build.index,
          template: 'index.html',
          inject: true,
          // 加载dll文件，并且插入到html的script资源      
          vendorJsName: bundleConfig.vendor.js,
          minify: {
             removeComments: true,
             collapseWhitespace: true,
             removeAttributeQuotes: true
           }
        }),
    ]
}
```
配置完以上的代码之后，我们就可以执行日常的业务代码打包
```bat
webpack build/webapck.dev.conf.js   # 开发环境
webpack build/webapck.prod.conf.js   # 生成环境
```

最终打包后的运行文件是这样的
![](/blog_assets/webpack_dll.png)      


___     
### Tree-shaking     
##### tree-shaking的原理
在集合ES 6模块和commonJS模块的区别之后，我们知道ES 6的特点是静态解析，而CommonJS的特点是动态解析，tree-shaking是借助于ES 6的静态解析特点，所以，这里要注意，我们默认触发tree-shaking的方法就是使用ES 6的模块化。   

同时也要普及一个观念，tree-shaking打包之后，仅仅是撇开了模块的引用，但是还要结合压缩工具(uglifyJS等)来进行，这样才是一次完整的`tree-shaking`
##### 函数的副作用   
这里篇幅有限，我只抛砖引玉，原文在此[传送门👉](https://zhuanlan.zhihu.com/p/32831172)  
正常情况下，我们的webpack默认es6规范编写的模块都能使用tree-shaking。但是这里涉及到一个函数副作用的概念，简单的来说就是一个函数会对函数外部的变量产生影响的行为。一旦出现了函数副作用，那么默认的tree-shaking就并不会生效。       

由于`babel`转码会产生副作用，而且我们常用的`uglifyJS`插件也会导致代码产生副作用。所以我们要考虑将这些操作，移动到webpack形成bundle之后进行。        


##### 解决方案  
1️⃣ 现将我们的代码进行tree-shaking打包，在最后进行bundle的babel转码和uglifyJS的压缩。但是只能够对自身的公共库进行shaking，收效并不大。        

2️⃣ node_modules模块包开发者，使用模块单独导出的模块式，比如说组件库的`button`和`scroll`组件分别单独是一个目录，使用的时候再加上一个`babel-xxx-transform`垫片     
```js
// 将以下代码
import {Button,Scroll} from 'antd';   // 此处为全部引入，有shaking的需要  
// 转化为一下代码(转化为单独引入)，相当于手动shaking了
import Button from 'antd/lib/button';
import Scroll from 'antd/lib/scroll';
```

3️⃣ 还是作为模块的开发者，我们可以考虑将模块转译/压缩的工作交给使用者去进行，这样就可以在使用的时候先进行`tree-shaking`，再进行转码了。(参考第一条)     
但是目前的大情况是，大多数的webpack配置都默认忽略对`node_modules`的转译配置，但不可否认这是一条可行的路子。     

4️⃣ 直接改为使用`rollup`进行打包。(生态明显没有webapck，入门门槛高，以后再讨论)       

5️⃣ 结合第一条和第三条，我们综合考虑如何实现先`tree-shaking`再进行`编译`与`压缩`。               
✅ 首先我们要将`loader`配置中的`babel-loader`给去掉...
```js
module.exports = {
    entry:'../main.jsx',
    output:{
        filename:'bundle.js'
    },
    module:{
        rules:[
            {
                test:/\.jsx?$/,
                exclude:/node_modules/, // 排除掉node_modules目录下的转码
                use:{
                    loader:'babel-loader',
                    options:{
                        presets:['es2015','react']
                    }
                }
            }
        ]
    }
}
```     
✅ 再者我们将这一部分的`转译`工作，转换到`plugin`中进行。改为使用`babel-minify-webpack-plugin`将`minify`和`babel`的操作合在一个插件中处理。[插件传送门👉](https://webpack.docschina.org/plugins/babel-minify-webpack-plugin/)               

```js 
const MinifyPlugin = require('babel-minify-webpack-plugin'); // 引入插件
module.exports = {
    entry://...
    output://...
    plugins:[
        new MinifyPlugin(minifyOpts, {
            test:/\.js($|\?)/i, // 表示匹配哪些文件
            comments:,// 表示保留哪些注释？
            sourceMap:,//会覆盖 webapckConfig.devtool的值，默认为webapck配置中的值，
            babel:,// 允许自定义一个 babel-core,
            minifyPreset:,//允许自定义一个 minify preset
        })
    ]
}
```
6️⃣ 最新的webpack 4.x中出现了用于消除`side-effect`的配置     
新的 webpack 4 正式版本，扩展了这个检测能力，通过 package.json 的 "sideEffects" 属性作为标记，向 compiler 提供提示，表明项目中的哪些文件是需要进行特殊对待(特殊考虑)的文件,若设置为false，指默认为没有副作用。    

```json
// 引用库的 panckage.json
{   
    "name":"super-big-module",
    "sideEffexts":false
}
// 或者列举有副作用文件的配置
{   
    "name":"super-big-module",
    "sideEffexts":[
        "./src/lib/aaa.js" // 列举出有副作用的文件，webapck将会特殊对待
    ]
}
```
详细配置请参考官方文档，[传送门👉](https://webpack.docschina.org/guides/tree-shaking/#src/components/Sidebar/Sidebar.jsx)

sideEffect配置参考[传送门👉](https://segmentfault.com/a/1190000015689240)
___
### 其他常见操作   

##### 开启GZip压缩   
开启Gzip压缩可以有效地减少`http`传输量的的大小，减少传输时间，从而提高性能。     
```js
const CompressionWebpackPlugin = require('compression-webpack-plugin');

webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp('\\.(js|css)$'),
      threshold: 10240,
      minRatio: 0.8
    })
)
```


##### 使用代码混淆和压缩     
使用`UglifyJS`等压缩工具，对js代码进行压缩，取出空格、注释，有效地减小代码体积。     
```js
var webpack = require('webpack');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.js'
  },
  plugins: [
    new UglifyJsPlugin()
  ]
};
```
##### devtools   
开发环境推荐使用：`cheap-module-eval-source-map`     
生产环境推荐使用：`cheap-module-source-map`       

`cheap`表示不用计算列信息     

`module`表示可以支持babel之中预编译工具的调试     

`eval`可以大幅度提高持续构建的效率    

___
### 总结 
| 优化方案  | 解决痛点   | 使用对象  |
|---|---|---|
|  webpack-bundle-analyzer |  搞清楚模块间的关系和大小  | 全局  |
|  external |  搞清楚模块间的关系和大小  | 比较大的资源包，或者是不能参与打包的内容  |
|  hash |  最大程度上使得文件可以缓存，减少请求  |  根据不同类型文件，缓存需求不一致设置 |
|  CommonChunkPlugin |  抽取公共模块，减小总模块大小  |  公共模块进行抽取(每次都打包) |
|  DllPulgin 和 DllReferencePlugin |  减少静态资源(依赖)的打包，只对当前业务进行打包  |  对于静态依赖包操作(少数打包) |  
|  code-spliting |  利用ES 6模块化的机制，实现编程式的代码分割，实现代码的懒加载  |  对于当前模块未用到的模块进行懒加载处理 |  
|  tree-shaking |  减少对大模块中无用代码的引入，有效减少打包结果的大小  |  对于依赖包中未被使用的部分进行删除 |
|  devtools |  生成的代码的压缩程度与是否可调式，关系到需要操作的时间长短  |  全局 |
|  GZip |  进行代码的压缩，减小代码体积 |  全局 |
|  uglifyJS |  压缩最终打包的代码，清除注释，实现最终的tree-shaking  |  全局 |
___
### 参考文章
[webapck 4 tree-shaking](https://blog.csdn.net/haodawang/article/details/77199980)   
[devtools 配置详解](https://www.cnblogs.com/hhhyaaon/p/5657469.html)        
[webpack 缓存静态资源那点事](http://www.cnblogs.com/wonyun/p/8146139.html)     