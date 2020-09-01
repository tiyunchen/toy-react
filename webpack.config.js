
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    entry: {
        main: './main.js'
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/dist'
    },
    // devtool: '',
    mode: 'development',
    optimization: {
        minimize: false
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader', // 所有的以js结尾的文件都要通过babel-loader 进行转义为就的js语言
                    options: {
                        // todo bable 里面 presets 和 plugins 的区别
                        presets: ['@babel/preset-env'],
                        plugins: [
                            ['@babel/plugin-transform-react-jsx', {pragma: 'createElement'}] // todo pragma 又是什么呢
                        ]
                    }
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './main.html',
            filename: 'main.html'
        }),
    ]
}