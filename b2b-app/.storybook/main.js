const CircularDependencyPlugin = require('circular-dependency-plugin')

module.exports = {
  stories: [
    '../imports/ui/admin/forms/survey-builder/**/*.stories.mdx',
    '../imports/ui/admin/forms/survey-builder/**/*.stories.@(js|jsx)',
  ],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  babel: async (options) => {
    // enable top-level import treeshaking to reduce startup time
    // https://material-ui.com/guides/minimizing-bundle-size/#option-2
    options.plugins.push([
      'babel-plugin-transform-imports',
      {
        '@material-ui/core': {
          transform: '@material-ui/core/esm/${member}',
          preventFullImport: true,
        },
        '@material-ui/icons': {
          transform: '@material-ui/icons/esm/${member}',
          preventFullImport: true,
        },
      },
    ])
    return options
  },
  // webpackFinal: (config) => {
  //   // config.resolve.alias['meteor/meteor'] = require.resolve('./__mocks__/meteor.js')
  //   config.plugins.push(
  //     new CircularDependencyPlugin({
  //       // exclude detection of files based on a RegExp
  //       exclude: /node_modules/,
  //       // add errors to webpack instead of warnings
  //       failOnError: true,
  //       // allow import cycles that include an asyncronous import,
  //       // e.g. via import(/* webpackMode: "weak" */ './file.js')
  //       allowAsyncCycles: false,
  //       // set the current working directory for displaying module paths
  //       cwd: process.cwd(),
  //     })
  //   )
  //   return config
  // },
}
