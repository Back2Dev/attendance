const path = require('path');

const saveRootPath = encodeURIComponent(path.join(__dirname, '../public'));
const findCacheDir = require('find-cache-dir');

module.exports = {
  module: {
    rules: [
      {
        test: /\.js($|\?)/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          babelrc: false,
          cacheDirectory: findCacheDir({ name: 'storybook' }),
          presets: ["@babel/preset-env", "@babel/preset-react"],
          plugins: [
            ['babel-plugin-root-import',{
              "paths": [{"rootPathPrefix": "/"}]},],
            '@babel/plugin-proposal-object-rest-spread',
            '@babel/plugin-proposal-class-properties'
          ],
        },
      },
      {
        test: /\.(scss|css)$/,
        loaders: [
          `style-loader`,
          `css-loader`,
//          `sass-loader?root=${saveRootPath}`,
        ],
      },
      {
        test: /.(png|woff|woff2|eot|ttf|svg|jpg|gif)(\?|$)/,
        loader: `url-loader?limit=100000&root=${saveRootPath}`,
      },
    ],
  },
  externals: {
    jsdom: 'window',
    cheerio: 'window',
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': 'window',
    'react/addons': true,
  },
  node: {
    fs: 'empty',
  },
};
