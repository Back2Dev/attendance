module.exports = {
  setupFiles: ['./tests/setup.jest.js'],
  verbose: true,
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },
  testRegex: '/tests/snapshots/stories.js',
  moduleNameMapper: {
    '/imports/(.*)': '<rootDir>/imports/$1',
    '\\.(css|less)$': '<rootDir>/tests/mocks/styleMock.js',
    'meteor/(.*)': '<rootDir>/tests/mocks/$1.js'
  },
  modulePaths: ['<rootDir>/node_modules/', '<rootDir>/node_modules/jest-meteor-stubs/lib/'],
  testPathIgnorePatterns: ['/.meteor/', '.storybook', '/node_modules/', '/semantic-ui/']
}
