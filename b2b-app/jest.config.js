/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

module.exports = {
  // A map from regular expressions to paths to transformers
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
    '^.+\\.mdx?$': '@storybook/addon-docs/jest-transform-mdx',
  },
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/tests/snapshots/__mocks__/fileMock.js',
  },
}
