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