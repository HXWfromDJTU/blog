## webpack多页面入口配置

`vue`官方提供的`vue-cli`项目生成工具，生成的是单入口的单页面`vue`工程。但是公司项目的需求，担心每个模块大小过大，遂决定修改`webapck`配置，进行多页面的配置改造。

### 改造
多页面配置与单页面配置，其实在大部分都还是相同的(单页面配置解读，[摸这里](./single_entry.md))。`loader`、`output`、`plugins`这些都算是共用的配置，不需要修改。主要修改一下三个配置：   
1️⃣ 与打包入口相关的`entry`   
2️⃣ `css`代码分离插件`extract-text-webpack-plugin`   
3️⃣ `js`代码注入插件`html-webpack-plugin`   

来看一个开发目录结构
![多入口](/blog_assets/webpack_multi_entry.png)

### 对应修改
单页面入口配置
```js
entry: {
     app: './src/main.js'
},
```
```js
  plugins: [
      // css 分离插件
       new ExtractTextPlugin(utils.assetsPath('css/[name].css')),
        // ...... 其他插件
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            favicon: 'favicon.ico',
            inject: true
        })
    ]
```
多页面配置(2个入口)
```js
const cameraMapCss =  new ExtractTextPlugin('cameraMap/[name].[contenthash].css');
const dashboardCss = 	new ExtractTextPlugin('dashboard/[name].[contenthash].css');
//...
entry:{
    cameraMap:resolve(__dirname,"src/cameraMap/cameraMap.js"),
    dashboard:resolve(__dirname,"src/dashboard/dashboard.js")
},
module:{
   rules:[
       // 限制每个页面的 ExtractTextPlugin 只处理这个页面的样式文件
       {
           test:/src(\\|\/)cameraMap(\\|\/)cameraMap(\\|\/).*\.(css|scss)$/,
           use:cameraMapCss.extract({
               fallback: 'style-loader',
               use: ['css-loader', 'postcss-loader', 'sass-loader']
           })
       },
         {
           test:/src(\\|\/)dashboard(\\|\/)dashboard(\\|\/).*\.(css|scss)$/,
           use:dashboard.extract({
               fallback: 'style-loader',
               use: ['css-loader', 'postcss-loader', 'sass-loader']
           })
       }
   ]
},
  plugins: [
         // 每个页面都要手动去添加
         cameraMapCss,
        dashboardCss,
        new HtmlWebpackPlugin({
            filename: 'src/cameraMap/cameraMap.html',
            template: 'cameraMap.html',
            favicon: 'favicon.ico',
            inject: true
        }),
          new HtmlWebpackPlugin({
            filename: 'src/dashboard/dashboard.html',
            template: 'dashboard.html',
            favicon: 'favicon.ico',
            inject: true
        })
    ]
```

### 自动化配置
当模块增多，页面也会增多，我们自然不愿意在配置中去手写每一次添加的配置，也不符合项目各人员间的协作。

让我们再看看这个开发目录
![多入口](/blog_assets/webpack_multi_entry.png)
#### 提取关键信息
* 相当于每一个单一模块都是一个单个口`app`
* 每个模块的入口，为放在第二层目录下的`.js`文件

#### 自动获取入口
设计一个自动获取
```js
function getEntry(){
    let globalPath = 'src/views/**/**/*.html';
    let pathDir = 'src(\/|\\\\)(.*?)(\/|\\\\)views'
    let files = flob.sync(globPath)
    let  dirname,entries = [];
    for(let i= 0 ;i < files.length; i++){
        dirname = path.dirname(files[i]);
        entries.push(dirname.replace(new RegExp('^'+pathDir),'$2'));
    }
}
```
###### 修改后的配置
入口
```js
function addEntry(){
    let entryObj = {};
    getEntry().forEach(item = >{
        entryObj[item] = resolve(__dirname,'src','views,item+'.js');
    });
    return entryObj;
}
entry:addEntry();
```
抽离css
```js
const pageExtractCssArray = [];
getEntry.forEach(item =>{
    pageExtractCssArray.push(new ExtractPlugin(item + '/[name].[contenthash].css'))
})
//......
plugin:[...pageExtractCssArray];
//......
getEntry().forEach((item,i)=>{
    webpackconfig.module.rules.push({
        test: new RegExp('src' + '(\\\\|\/)' + item + '(\\\\|\/)' + 'css' + '(\\\\|\/)' + '.*\.(css|scss)$'),
        use:pageExtractCssArray[i]({
            fallback:'style-loader',
            use:['css-loader','postcss-loader','sass-loader']
        })
    })
})
```
注入js
```js
getEntry.forEach(pathname=>{
    let conf = {
        filename:path.join(pathname,pathname)+'.html',
        template:path.join(__dirname,'src','views',pathname,pathname+'.html')
        webpackconfig.plugins.push(new HtmlWebpackPlugin(conf))
    }
})
// ......
module.exports = webpackconfig;
```

## webpack 4+ 配置
来源  [《webpack4 + 多入口配置 -- 富途web》](https://juejin.im/post/5af3a6cbf265da0ba266ff25)
#### 使用Split Chunks，分离重复打包的js
```js
new webpack.optimize.SplitChunksPlugin({
    chunks: 'all',
    minSize: 30000,
    minChunks: 1,
    maxAsyncRequests: 5,
    maxInitialRequests: 3,
    automaticNameDelimiter: '-',
    name: true,
    cacheGroups: {
        vue: {
            test: /[\\/]node_modules[\\/]vue[\\/]/,
            priority: -10,
            name: 'vue'
        },
        'tui-chart': {
            test: /[\\/]node_modules[\\/]tui-chart[\\/]/,
            priority: -20,
            name: 'tui-chart'
        }
    }
})
```

#### 使用 `MiniCssExtract`提取为外部CSS
```js
// rules配置
{
  test: /\.s?[ac]ss$/,//postcss-loader 依赖 postcss-config.js
  use: [MiniCssExtractPlugin.loader,'css-loader','postcss-loader','sass-loader'] 
}
// plugin配置
new MiniCssExtractPlugin({ //提取为外部css代码
    filename:'[name].css?v=[contenthash]'
})
```
