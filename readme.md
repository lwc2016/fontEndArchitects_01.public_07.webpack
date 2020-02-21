#### 一，webpack配置
```
module.exports = {
    entry: "./src/index.j",     // 入口
    output: {},                 // 出口
    devServer: {},              // 开发服务器配置
    module: {},                 // 模块配置
    plugins: [],                // 插件配置
    mode: "development",        // 模式
    resolve: {}                 // 配置解析
}
```
1. output的参数：
- path:       输出的目录，这里必须时个绝对路径
- filename:   输出的文件名称
- publicPath: 输出的文件在html中引用时的前置路径
2. devServer的参数：
- contentBase: 服务器的根目录
- port:        端口号
- open:        启动服务器时自动打开浏览器
- hot:         开启热更新 
3. module的参数：
- rules:       配置需要解析文件的loader  

#### 二，启用开发服务器及热更新
1. 启用开发服务器时需要打开devServer，配置信息如下：
```
{
    devServer: {
        contentBase: "./dest",   // 设置服务器的根目录
        port: 8080,              // 设置服务器的端口号
        open: true,              // 启动webpack-dev-server时，自动打开浏览器
        hot: true,               // 开启热更新
    }
}
```
2. 开启个更新，需要用到webpack模块中的hotModuleReplacementPlugin插件
```
{
    plugins: [
        new webpack.hotModuleReplacementPlugin()
    ]
}

/*
注意：这里配置完成后，修改js时，浏览器会重新刷新页面以达到显示最新内容目的。但在react/vue中使用状态管理时，浏览器刷新页面时数据就消失了。
因此这里需要使用局部刷新，而浏览器不需要刷新。
这需要在index.js中进行设置
*/

if(module.hot){
    module.hot.accept();
}
```
#### 三，loader的使用
1. 解析css文件，需要使用的loader:
- css-loader: 将css文件转换成js能够识别的数据
- style-loader: 将css样式放到<style></style>标签中，然后插入到<head></head>标签中

```
{
    module: {
        rules: [
            {test: /\.css$/, use: [
                {loader: "style-loader"},
                {loader: "css-loader"}
            ]}
        ]
    }
}
```

2. 解析less文件
- less-loader: 将less文件数据，转换成css
```
{
    module: {
        rules: [
            {test: /\.less/, use: [
                {loader: "style-loader"},
                {loader: "css-loader"},
                {loader: "less-loader"}
            ]}
        ]
    }
}
```

3. 给css属性添加浏览器前缀
- postcss-loader
```
{
    module: {
        rules: [
            {test: /\.css$/, use: [
                {loader: "style-loader"},
                {loader: "css-loader"},
                {loader: "postcss-loader"}
            ]}
        ]
    }
}


// 需要设置postcss选项，postcss.config.js中：
module.exports = {
    plugins: [
        require("autoprefixer")
    ]
}
```

#### 四，插件的使用
1. html-webpack-plugin：将html模板打包到指定目录中
```
// npm install html-webpack-plugin --save-dev
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",    // 模版地址
            filename: "./dist/index.html",   // 输出地址 
            title: "前端架构-webpack",        // 文档标题
            minify: {                        // 压缩html
                collapseWhitespace: true
            }
        })
    ]
}
```
2. clean-webpack-plugin：清除指定文件
```
// npm install clean-webpack-plugin --save-dev
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
    plugins: [
        new CleanWebpackPlugin(["./dist"]),   // 清空dist目录中的文件
    ]
}
```
3. extract-text-webpack-plugin：将css样式抽出来，打包成一个独立的文件
```
// npm install extract-text-webpack-plugin@next --save-dev
// 备注说明：这个插件的功能和style-loader作用正好相反，所以不能同时使用
const ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");

{
    module: {
        rules: [
            {test: /\.css$/, use: ExtractTextWebpackPlugin.extract({
                fallback: "style-loader",      // 这个插件设置disable时，则使用style-loader将css样式放到html中
                use: [
                    {loader: "css-loader"}
                ]
            })}
        ]
    },
    plugins: [
        new ExtractTextWebpackPlugin({
            filename: "[name].css",
            disable: false,  // 当设置true时，这个插件不起作用
        })
    ]
}
```
4. mini-css-extract-plugin: 这个插件的功能也是将css样式抽离处理，单独打包成一个css文件
```
// npm install mini-css-extract-plugin --save-dev
// 这个插件也是和style-loader不兼容
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

{
    module: {
        rules: [
            {test: /\.css/, use: [
                {loader: MiniCssExtractPlugin.loader},
                {loader: "css-loader"}
            ]}
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].js"
        })
    ]
}
```
5. optimize-css-assets-webpack-plugin: 压缩css样式
```
// npm install optimize-css-assets-webpack-plugin --save-dev
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");

{
    plugins: [
        new OptimizeCssAssetsWebpackPlugin({
            assetNameRegExp: /\.css$/g,          // 需要匹配css文件
            cssProcessor: require("cssnano"),    // 配置预处理器
        })
    ]
}
```

6. purify-css-webpack: 将未使用的css样式清除掉
```
// npm install purify-css-webpack purifycss glob --save-dev
const PurifyCssWebpack = require("purify-css-webpack");
const glob = require("glob");
const path = require("path");

{
    plugins: [
        new PurifyCssWebpack({
            paths: glob.sync(path.join(__dirname, "./src/*.html"))
        })
    ] 
}
```
#### 五，最佳实践
1. webpack基本配置
```
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "./dest")
    },
    module: {
        rules: [
            {test: /\.css$/, use: ExtractTextWebpackPlugin.extract({
                fallback: "style-loader",
                use: [
                    {loader: "css-loader"},
                    {loader: "postcss-loader", options: {
                        plugins: [require("autoprefixer")]
                    }}
                ]
            })},
            {test: /\.less$/, use: ExtractTextWebpackPlugin.extract({
                fallback: "style-loader",
                use: [
                    {loader: "css-loader"},
                    {loader: "less-loader"}
                ]
            })}
        ]
    },
    plugins: [
        new ExtractTextWebpackPlugin({
            filename: "index.[hash:8].css",
            disable: process.env.NODE_ENV === "development"
        }),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            title: "webpack全栈架构--webpack",
        })
    ]
}
```
2. 开发环境配置
```
const path = require("path");
const webpack = require("webpack");
process.env.NODE_ENV = process.env.NODE_ENV || "development";
const webpackMerge = require("webpack-merge");
const baseConfig = require("./webpack.base");

module.exports = webpackMerge(baseConfig, {
    output: {
        filename: "[name].js"
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ],
    devServer: {
        contentBase: path.resolve(__dirname, "./dist"),
        port: 8080,
        hot: true,
        open: true
    },
    mode: "development"
}) 
```
3. 生产环境配置
```
// 设置环境变量
process.env.NODE_ENV = process.env.NODE_ENV || "production";

const PurifycssWebpack = require("purifycss-webpack");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const baseConfig = require("./webpack.base");
const webpackMerge = require("webpack-merge");
const path = require("path");
const glob = require("glob");


module.exports = webpackMerge(baseConfig, {
    output: {
        filename: "main.[chunkhash].js"
    },
    plugins: [
        new PurifycssWebpack({
            paths: glob.sync(path.resolve(__dirname, "./src/*.html"))
        }),
        new OptimizeCssAssetsWebpackPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require("cssnano")
        })
    ],
    mode: "production"
}) 
```