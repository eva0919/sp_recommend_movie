// 這邊使用 HtmlWebpackPlugin，將 bundle 好的 <script> 插入到 body。${__dirname} 為 ES6 語法對應到
// __dirname
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // 檔案起始點從 entry 進入，因為是陣列所以也可以是多個檔案
  entry: ["./src/index.js"],
  // output 是放入產生出來的結果的相關參數
  output: {
    path: `${__dirname}/public`,
    filename: "bundle.js"
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader"
      }
    }, {
      test: /\.css$/,
      use: [{
        loader: "style-loader"
      }, {
        loader: "css-loader",
        options: {
          modules: true
        }
      }]
    }]
  },
  // plugins 放置所使用的外掛
  plugins: []
};