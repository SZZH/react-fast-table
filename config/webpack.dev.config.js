const path = require('path');

const devConfig = {
  mode: 'development', // 开发模式
  entry: path.join(__dirname, "../example/app.js"), // 项目入口，处理资源文件的依赖关系
  output: {
    path: path.join(__dirname, "../example/"),
    filename: "bundle.js", // 使用webpack-dev-sevrer启动开发服务时，并不会实际在`src`目录下生成bundle.js，打包好的文件是在内存中的，但并不影响我们使用。
  },
  module: {
    rules: [
      {
        // 使用 babel-loader 来编译处理 js 和 jsx 文件
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        exclude: /node_modules/
      },
      // {
      //   test: /\.(js|jsx)$/,
      //   exclude: /(node_modules|bower_components)/,
      //   use: {
      //     loader: 'babel-loader',
      //     options: {
      //       presets: ['@babel/preset-env']
      //     }
      //   }
      // },
      {
        test: /\.css$/,
        exclude: /\.min\.css$/,
        loader: ['style-loader','css-loader'],
      },
      {
        test: /\.min\.css$/,
        loader: ['style-loader','css-loader'],
      },
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, '../example/'),
    compress: true,
    hot: true,
    host: '127.0.0.1', // webpack-dev-server启动时要指定ip，不能直接通过localhost启动，不指定会报错
    port: 3001, // 启动端口为 3001 的服务
    open: true, // 自动打开浏览器
    proxy: {
      '/api/': {
        target: 'http://localhost:3030',
        changeOrigin: true
      }
    }
  },
};
// module.exports = merge(devConfig, baseConfig); // 将baseConfig和devConfig合并为一个配置
module.exports = devConfig; // 将baseConfig和devConfig合并为一个配置