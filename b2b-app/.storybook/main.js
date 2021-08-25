module.exports = {
  stories: [
    '../imports/ui/**/*.stories.mdx',
    '../imports/ui/**/*.stories.@(js|jsx|ts|tsx)',
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
}
