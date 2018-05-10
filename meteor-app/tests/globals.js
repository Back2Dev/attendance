// import { TestScheduler } from 'rxjs';
import chai, { expect, assert } from 'chai';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import { beforeEach, afterEach } from 'mocha';
// import { createConnection, createMethod } from './mocks/rx-meteor';

chai.use(chaiEnzyme());

global.expect = expect;	
global.mount = mount;
// global.createConnection = createConnection;
// global.createMethod = createMethod;
// global.filepicker = {
//   pickAndStore: () => {},
//   remove: () => {},
//   extend: () => {},
//   internal: () => {},
// };
global.SimpleSchema = () => {};

// const ts = new TestScheduler(assert.deepEqual);
// global.hot = ts.createHotObservable.bind(ts);
// global.cold = ts.createColdObservable.bind(ts);
// global.expectObservable = ts.expectObservable.bind(ts);
// global.flush = ts.flush.bind(ts);
// // to test observables we need to flush after every it (), and if we forget it we get a false positive
// afterEach(() => {
//   ts.flush();
// });

// beforeEach(() => {
//   ts.frame = 0;
// });
