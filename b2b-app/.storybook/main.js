const CircularDependencyPlugin = require('circular-dependency-plugin')
const path = require('path')

module.exports = {
  stories: [
    '../imports/ui/**/*.stories.@(js|jsx|mdx)',
    // '../imports/ui/admin/forms/survey-builder/**/*.stories.mdx',
    // '../imports/ui/admin/forms/survey-builder/**/*.stories.@(js|jsx)',
  ],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  webpackFinal: async (config, { presets }) => {
    const instance = (await presets.apply('webpackInstance')).default
    // need these 2 lines because builder renders incomplete stories as it uses form/framework
    // context which imports preview-panel which logs a ReferenceError: EditorPanel not defined
    config.resolve.alias['meteor/meteor'] = require.resolve('./__mocks__/meteor.js')
    // config.plugins.push(
    //   new instance.NormalModuleReplacementPlugin(
    //     /preview-panel/,
    //     path.resolve(__dirname, './__mocks__/preview-panel.js')
    //   ),
    //   new instance.NormalModuleReplacementPlugin(
    //     /\/imports\/api\/surveys/,
    //     path.resolve(__dirname, './__mocks__/api-survey-maps.js')
    //   )
    // )
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
    return config
  },
}
