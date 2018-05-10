var jsdom = require("jsdom/lib/old-api.js").jsdom;
// import { jsdom } from 'jsdom';
import proxyquire from 'proxyquire';
import path from 'path';
import globalMocks from './mocks';

const exposedProperties = ['window', 'navigator', 'document'];

global.document = jsdom('');
global.window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'node.js',
};

const proxyquireStrict = proxyquire.noCallThru();
const globalRexExp = /^~?\/(.+)$/;

global.mockImport = (module, mocks = {}) => {
  const moduleGlobalPathMatch = module.match(globalRexExp);
  const modulePath = path.relative(__dirname, path.join(__dirname, '..', moduleGlobalPathMatch[1]));
  try {
    const mockModules = Object.assign({}, globalMocks, mocks);
    const parsedMockModules = Object.keys(mockModules).reduce((reducedParsedMockModules, moduleMockPath) => {
      const globalPathMatch = moduleMockPath.match(globalRexExp);
      const mockModule = Object.assign(mockModules[moduleMockPath], { '@global': true });
      if (globalPathMatch) {
        const absolutePath = path.resolve(__dirname, '..', globalPathMatch[1]);
        return Object.assign({}, reducedParsedMockModules, { [absolutePath]: mockModule });
      }
      return Object.assign({}, reducedParsedMockModules, { [moduleMockPath]: mockModule });
    }, {});
    const mock = proxyquireStrict(modulePath, parsedMockModules);
    return mock;
  } catch (e) {
    const stack = e.stack.split('\n');
    const [first] = stack;
    const moduleError = first.match(/Cannot find module '(.*?)'/);
    if (moduleError) {
      const moduleChain = stack
        .map(error => error.match(/at Object.<anonymous> \((.*?):\d+:\d+\)/))
        .filter(match => match)
        .map(match => match[1])
        .map(file => `\nin '${file}'`)
        .join('');
      const errorMessage = `\n\ncan't resolve '${moduleError[1]}'${moduleChain}`;
      const newError = new Error(errorMessage);
      newError.stack = newError.stack = errorMessage;
      throw newError;
    }
    throw e;
  }
};

global.mockImportDefault = (module, mocks = {}) => global.mockImport(module, mocks).default;
