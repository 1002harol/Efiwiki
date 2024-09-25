
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postcssNormalize = require('postcss-normalize');

module.exports = function override(config, env) {
  // Ensure we use babel-preset-env
  const babelLoader = config.module.rules.find(rule => rule.loader && rule.loader.includes('babel-loader'));
  if (babelLoader) {
    babelLoader.options = {
      presets: [
        ['@babel/preset-env', {
          targets: "> 0.25%, not dead"
        }],
        '@babel/preset-react'
      ],
      plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-transform-runtime'
      ]
    };
  }

  // Modify CSS processing
  const cssRule = config.module.rules.find(rule => rule.test && rule.test.toString().includes('.css'));
  if (cssRule && cssRule.oneOf) {
    const cssModuleRule = cssRule.oneOf.find(rule => rule.test && rule.test.toString().includes('module'));
    if (cssModuleRule) {
      cssModuleRule.use = [
        env === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
            modules: {
              localIdentName: '[name]__[local]___[hash:base64:5]',
            },
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [
                'postcss-flexbugs-fixes',
                ['postcss-preset-env', {
                  autoprefixer: {
                    flexbox: 'no-2009',
                  },
                  stage: 3,
                }],
                postcssNormalize(),
                'cssnano',
                ['@fullhuman/postcss-purgecss', {
                  content: [
                    './src/**/*.html',
                    './src/**/*.js',
                    './src/**/*.jsx',
                    './public/index.html',
                  ],
                  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
                }],
              ],
            },
          },
        },
      ];
    }
  }

  // Customization to split out modern and legacy code
  config.output = {
    ...config.output,
    filename: 'static/js/[name].[contenthash:8].js',
    chunkFilename: 'static/js/[name].[contenthash:8].chunk.js'
  };

  // Add the `module`/`nomodule` script tag strategy
  config.plugins.push(
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].chunk.css'
    })
  );

   // Añadir regla para archivos de fuentes
   config.module.rules.push({
    test: /\.(woff|woff2|eot|ttf|otf)$/,
    use: [
      {
        loader: 'file-loader',
        options: {
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
    ],
  });
  return config;
};