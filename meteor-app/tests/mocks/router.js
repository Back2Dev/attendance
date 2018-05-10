/**
 * Iron Router mocks
 *
 * Components can't require('meteor/iron:router') while being mounted
 * in the test suite, so we can use proxyquire to replace it with this mock.
 * See the example in tests/enzyme/accountcontainer-test.js
 */


export default {
  Router: {
    customHelpers: {
      pathFor(routename, props = {}) {
        const propsToString = Object.keys(props).reduce((acc, prop) =>
          `${acc}/${prop}/${props[prop]}`
        , '');
        return `/${routename}/${propsToString}`;
      },
    },
    routes: {
      settings: '/settings',
    },
  },
};
