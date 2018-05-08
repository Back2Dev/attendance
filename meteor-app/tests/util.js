import sinon from 'sinon';

// Object function mocks. To test whether callbacks like componentDidMount are called
const mockedPropsStore = '__mocks__';

/* eslint-disable no-param-reassign */
export const mockFn = (obj, fnName) => {
  if (!obj[mockedPropsStore]) {
    obj[mockedPropsStore] = {};
  }

  obj[mockedPropsStore][fnName] = obj[fnName];
  obj[fnName] = sinon.spy();
};

export const unmockFn = (obj, fnName) => {
  obj[fnName] = obj[mockedPropsStore][fnName];

  delete obj[mockedPropsStore][fnName];

  if (Object.keys(obj[mockedPropsStore]).length === 0) {
    delete obj[mockedPropsStore];
  }
};
/* eslint-enable no-param-reassign */
