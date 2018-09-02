const path = require('path');
// 使用html模板打包生成新模板
let HtmlWebpackPlugin = require('html-webpack-plugin');
//拆分css内容，将css内容单独输出到一个文件中
let ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
// 自动清除输出目录插件
let CleanWebpackPlugin = require('clean-webpack-plugin');
// 引入webapck对象，因为需要配置 webpack.HotModuleReplacementPlugin 热更新内容插件
let Webpack = require('webpack');
//单文件配置
// module.exports = {
//     entry: './src/index.js',  //入口文件
//     output: {
//         filename: 'bundle.js',  //打包后的文件名称 
//         path: path.resolve('dist')   //打包后的目录，必须是绝对路径
//     },
//     module: {

//     },
//     plugins: [
//         //实用插件
//         new HtmlWebpackPlugin({
//             //用那个html作为模板
//             //在src目录下创建一个index.html页面当作模板
//             template: './src/index.html',
//             hash: true //会在打包好的bundle上追加上hash串
//         })
//     ],
//     // devserver: {},
//     mode: 'development'
// }


//多文件入口配置
module.exports = {
    // 多页面开发，怎么配置多页面 ，多入口文件
    entry: {
        index: './src/index.js',
        login: './src/login.js'
    },
    output: {
        //使用name来生成动态文件名
        filename: '[name].js',  //打包后的文件名称 
        path: path.resolve('dist')   //打包后的目录，必须是绝对路径
    },
    module: {
        rules: [
            {
                test: /\.(scss)$/,
                use: ExtractTextWebpackPlugin.extract({
                    // 将css用link的方式引入就不再需要style-loader了
                    use: 'css-loader' // 可以列举多个loader , 顺序为从右向左解析
                })
            },
            {
                test: /\.(jpe?g|png|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,   //小于8K的图片直接转成base64，并不会存在实体图片
                            outputPath: './images/'
                        }
                    }
                ]
            },
            {
                test: /\.(htm|html)$/,
                use: 'html-withimg-loader'
            },
            {
                test: /\.(eot|ttf|woff|svg)$/,
                loader: 'file-loader',
                options: {
                    outputPath: './fonts/'
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
            },
            {
                test: /\.js$/,
                use: 'babel-loader',
                include: /src/,   // 只因为src目录下的 js
                exclude: /node_modules/  // 排除掉 node_modules
            }
        ]
    },
    plugins: [
        //实用插件
        new HtmlWebpackPlugin({
            //用那个html作为模板
            //在src目录下创建一个index.html页面当作模板
            template: './src/index.html',
            filename: 'index.html',
            hash: true //会在打包好的bundle上追加上hash串
        }),
        new HtmlWebpackPlugin({
            template: './src/login.html',
            filename: 'login.html',
            hash: true
        }),
        new ExtractTextWebpackPlugin('style/style.css'),
        new CleanWebpackPlugin('dist'),
        new Webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        contentBase: './dist',
        host: 'localhost',
        port: 3000,
        Open: true, //是否默认打开浏览器
        hot: true  //是否热更新
    },
    resolve: {
        //别名
        alias: {
            $: './src/jquery.js',
            extensions: ['.js', '.json', '.css']  //省略后缀
        }
    },
    mode: 'development'
}