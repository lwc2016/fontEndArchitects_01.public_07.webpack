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