//
// A list of targets for deployment
//
const choices = {
  'b2b-prod': {
    app: 'meteor-app',
    name: 'b2b-prod',
    level: 'minor',
    branch: 'master'
  },
  'b2b-demo': {
    app: 'meteor-app',
    name: 'b2b-demo',
    level: '',    // Assumes prod goes first, this picks up the same version
    branch: 'master'
  },
  'b2b-staging': {
    app: 'meteor-app',
    name: 'b2b-staging',
    level: 'patch',
    branch: 'develop'
  },
  'b2b-test': {
    app: 'meteor-app',
    name: 'b2b-test',
    level: '',
    branch: 'develop'
  },
}

module.exports = choices