module.exports = {
  verbose: true,
  transform: {
    "^.+\\.js?$": "babel-jest"
  },
  moduleNameMapper: {
    "/imports/(.*)": "<rootDir>/imports/$1",
    "\\.(css|less)$": "<rootDir>/tests/mocks/styleMock.js",
    "^meteor/(.*)": "<rootDir>/tests/mocks/index.js"
  },
  modulePaths: [
    "<rootDir>/node_modules/",
    "<rootDir>/node_modules/jest-meteor-stubs/lib/"
  ],
  testPathIgnorePatterns: [
    "/.meteor/",
    ".storybook",
    "/node_modules/",
    "/semantic-ui/"
  ]
}