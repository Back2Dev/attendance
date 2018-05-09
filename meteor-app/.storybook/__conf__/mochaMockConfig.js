// import { jsdom } from 'jsdom';
var jsdom = require("jsdom/lib/old-api.js").jsdom;
// Mocks for mocha CLI test
const storiesOf = function storiesOf() {
  var api = {};
  api.add = (name, func)=> {
    func();
    return api;
  };
  api.addWithInfo = (name, func)=> {
    func();
    return api;
  };
  return api;
};
const action = () => {};

const linkTo = () => {};

const specs = (spec) => {
  spec();
};
const describe = () => {};
const it = () => {};

// Setting global variables
global.storiesOf = storiesOf;
global.action = action;
global.linkTo = linkTo;
global.specs = specs;
global.describe = describe;
global.it = it;

global.filepicker = {
  pickAndStore: () => {},
  remove: () => {},
  extend: () => {},
  internal: () => {},
};


/**
 * Mocking browser-like DOM
 */
global.document = jsdom('<!doctype html><html><body></body></html>', {
  headers: {
    'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_7)' +
    ' AppleWebKit/534.24 (KHTML, like Gecko) Chrome/11.0.696.71 Safari/534.24'
  }
});
global.window = document.defaultView;
global.navigator = global.window.navigator;
