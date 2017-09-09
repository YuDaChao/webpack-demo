const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin') // 提取js中的样式
// const extractLess = new ExtractTextPlugin({
//     filename: 'less/[name].[contenthash].less',
//     disable: process.env.NODE_ENV === 'development'
// })
// const extractCss = new ExtractTextPlugin({
//     filename: 'css/[name].[contenthash].css',
//     disable: process.env.NODE_ENV === 'development'
// })
const extractCss = new ExtractTextPlugin('style/[name]-css.css')
const extractLess = new ExtractTextPlugin('style/[name]-less.css')
module.exports = {
    entry: {
        index: './src/index.js',
    },
    output: {
        filename: 'js/[name]-[chunkhash:6]-bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        contentBase: './dist',
        hot: true
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: path.resolve(__dirname,'node_modules/'),
                include: [ // 可以是一个数组, 字符串
                    path.resolve(__dirname, 'src/')
                ],
                use: [
                    "babel-loader"
                ]
            },
            // 参看 
            // https://webpack.js.org/plugins/extract-text-webpack-plugin/#src/components/Sidebar/Sidebar.jsx
            {
                test: /\.css$/,
                // use: [
                //     "style-loader","css-loader","postcss-loader" // 有顺序的,从后向前
                // ]
                // use: extractCss.extract("css-loader")
                // use: extractCss.extract({
                //     use: ["css-loader", "postcss-loader"]
                // })
                 use: extractCss.extract(["css-loader", "postcss-loader"]) // 加入style-loader会出错？
            },
            {
                test: /\.less$/,
                use: extractLess.extract(["css-loader","less-loader", "postcss-loader"])
            }
            // {
            //     test: /\.less$/,
            //     // use: [{
            //     //     loader: "style-loader"
            //     // }, {
            //     //     loader: "css-loader"
            //     // }, {
            //     //     loader: "postcss-loader"
            //     // }, {
            //     //     loader: "less-loader", options: {
            //     //         strictMath: true,
            //     //         noIeCompat: true
            //     //     }
            //     // }]
            //     // use: [
            //     //     "style-loader","css-loader","postcss-loader","less-loader?strictMath=true&noIeCompat=true"
            //     // ]
            //     use: extractLess.extract({
            //         use: [{
            //             loader: "css-loader"
            //         }, {
            //             loader: "less-loader"
            //         }]
            //     })
            // }
        ]
    },
    plugins: [
        extractCss,
        extractLess,
        new ExtractTextPlugin({
            filename: 'css/[name].[contenthash].css'
        }),
        // 提取相同依赖 构建优化插件
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vender',
            filename: 'js/vender-[hash:6].min.js'
        }),
        // 代码压缩
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false,
            drop_console: true,
            pure_funcs: ['console.log']
          }
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        // 热替换
        new webpack.HotModuleReplacementPlugin(),
        // html 模版
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'index.html'
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ]
}
