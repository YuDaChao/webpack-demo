const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    entry: {
        index: './index.js',
    },
    output: {
        filename: '[name]-[chunkhash:6]-bundle.js',
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
                exclude: /node_modules/,
                use: [
                    "babel-loader"
                ]
            }
        ]
    },
    plugins: [
        // 提取相同依赖 构建优化插件
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vender',
            filename: 'vender-[hash].min.js'
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
