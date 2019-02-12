const path = require('path');

const HtmlWebPackPlugin = require("html-webpack-plugin");

const htmlPlugin = new HtmlWebPackPlugin({
  template: "./src/index.html",
  filename: "./index.html"
});

var config = {
   entry: ['babel-polyfill', './src/index.js'],
   output: {
     path: path.resolve(__dirname, 'dist'),
     filename: 'bundle.js'
   },
   devServer: {
      inline: true,
      port: 8080,
      historyApiFallback: true,
      publicPath: '/'
   },
   resolve: {
     modules: [path.join(__dirname, 'src'), 'node_modules']
   },
   module: {
      rules: [
         {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
         },
         {
            test: /\.scss$/,
            use: [{
              loader: "style-loader"
            }, {
              loader: "css-loader"
            }, {
              loader: "sass-loader"
            }]
        },
        {
           test: /\.css$/,
           loader: "style-loader!css-loader"
       },
       {
          test: /\.(woff(2)?|ttf|eot|svg|png|gif)(\?v=\d+\.\d+\.\d+)?$/,
          use: [{
              loader: 'file-loader',
              options: {
                  name: '[name].[ext]',
                  outputPath: 'fonts/'
              }
          }]
        }
      ]
   },
   devtool: 'cheap-module-eval-source-map',
    plugins: [htmlPlugin]

}
module.exports = config;
