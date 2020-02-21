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