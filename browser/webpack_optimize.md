# 前端性能优化系列 <h6>-从webpack打包说去</h6>


### 定位体积大的模块  
使用`webpack-bundle-analyzer`插件进行分析。我们知道了各个包大小关系，才能够更有效的布置以下的优化配置。     

![](/blog_assets/webpack-bundle-analyzer.png)  
___
### 代码分割    
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

### 使用hash缓存   
我们在前端优化的知识点中，有一点很重要的就是使用本地的缓存进行减少请求，以达到优化的效果。     
我们在给打包资源设置输出名称的时候，注意到有`[name]`、`[contenthash]`、`[hash]`、`[chunkhash]`等设置。
|配置项|含义|备注|
|---|---|---|
|[name]| 原始文件名的替代符 |   |
|[contenthash]| 文件内容有变化则跟着变化|   |
|[hash]|整个项目有变换的时候，hash值才会跟着变化|   |
|[chunkhash]|chunk有变化，chunkhash才跟着变化|   |   
##### Javascript与Css配置contenthash
Javascript和CSS一般是我们的业务代码,所以无论是内容发生一丁点的变化，我们也需要更新它。     
```js
output:{
    path:path.resolve(___dirname,'../dist');
    filename:'static/js/[name].[contenthash:8].js',
    publicPath:'/'
}
```   
```js   
new MiniCssExtractPlugin({
    filename:'static/css/[name].[contenthash:8].css'
})
```
___
### 抽离共同模块(依赖)      
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
        filename:'[name].js'
    },
    plugins:[
        new CommonChunkPlugin({
            name:['common','loadsh','vue'] // 注意要先配置合并的出口，再去配置插件类的合并        
        })
    ]
}
```
这一步的核心是要将重复的依赖，从各个模块中抽取出来，减小打包模块的总大小。但要注意，这样的打包每一次都会发生，包括我们日常的`dev`操作。  

### 使用“DllPulgin”和"DllReferencePlugin"来实现“部分打包”  🤣 
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

### 其他常见操作   

##### 开启GZip压缩   
开启GZip压缩可以有效地减少`http`传输量的的大小，减少传输时间，从而提高性能。     
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