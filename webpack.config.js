const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    entry: './src/index.js',
    output: {
      filename: isProduction ? 'glift.min.js' : 'glift.js',
      path: path.resolve(__dirname, 'dist'),
      library: {
        name: 'glift',
        type: 'umd',
        export: 'default'
      },
      clean: true
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: '> 0.25%, not dead'
                }]
              ]
            }
          }
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'images/[hash][ext][query]'
          }
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html',
        inject: 'head',
        scriptLoading: 'blocking'
      }),
      new CopyWebpackPlugin({
        patterns: [
          { 
            from: 'test/testdata',
            to: 'testdata'
          },
          {
            from: 'src/themes/assets',
            to: 'themes/assets'
          }
        ]
      })
    ],
    resolve: {
      extensions: ['.js'],
      alias: {
        '@': path.resolve(__dirname, 'src/'),
        '@core': path.resolve(__dirname, 'deps/glift-core/')
      }
    },
    devServer: {
      static: [
        {
          directory: path.join(__dirname, 'dist'),
        },
        {
          directory: path.join(__dirname, 'test'),
          publicPath: '/test'
        }
      ],
      devMiddleware: {
        writeToDisk: true
      },
      compress: true,
      port: 9000,
      hot: true,
      open: true
    },
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    performance: {
      hints: isProduction ? 'warning' : false
    },
    optimization: {
      minimize: isProduction
    }
  };
}; 