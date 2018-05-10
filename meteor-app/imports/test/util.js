/**
 * test/util
 * utilities for integration tests
 */

import { Meteor } from 'meteor/meteor';
import sinon from 'sinon';
import { expect } from 'chai';
import differenceWith from 'lodash/differenceWith';
import isEqual from 'lodash/isEqual';

/**
 * Stub Meteor.user() during the calling of a Meteor method
 * @param  {Object}    user
 * @param  {String}    method
 */
export const callStubbed = (user, method, ...args) => {
  if (!user && user !== null) throw new Error('stubUserCall requires object or null');

  const userStub = sinon.stub(Meteor, 'user');
  userStub.returns(user);
  const userIdStub = sinon.stub(Meteor, 'userId');
  userIdStub.returns(user._id);

  try {
    const result = Meteor.call(method, ...args);
    userStub.restore();
    userIdStub.restore();
    return result;
  } catch (err) {
    userStub.restore();
    userIdStub.restore();
    throw err;
  }
};



/**
 * Given 1 or more arrays, return a matrix of all the possible permutations
 * of those arrays.

 * For example: [1, 2] and [3, 4] =>
 *   [1, 3]
 *   [1, 4]
 *   [2, 3]
 *   [2, 4]
 *
 * @param  {Array} arrays
 * @return {Array}
 */
export const createPermutationsMatrix = (...arrays) => {
  function combineRecursive(sets) {
    if (sets.length === 1) return sets[0];
    const combined = [].concat(...sets[0].map(x =>
      sets[1].map(y => [...x, y])
    ));
    return combineRecursive([combined, ...sets.slice(2)]);
  }

  return combineRecursive([[[]], ...arrays]);
};


export const StringArray = Symbol;

const ARGUMENT_TYPE_MAP = new Map([
  [String, 'String'],
  [Object, {}],
  [Boolean, true],
  [undefined, undefined],
  [null, null],
  [Array, []],
  [StringArray, ['String']],
]);

const ARGUMENT_TYPES = [...ARGUMENT_TYPE_MAP.values()];

/**
 * Ensure a Meteor method is type-checking its arguments.
 * Throws if the method doesn't throw when given bad arguments.
 *
 * Usage:
 *
 *   validateArguments('meteorMethodName', [String, Object])
 *   validateArgumens('methodWithOptionalOobject', [String, [undefined, String]])
 *
 * Pass error argument to check against a different error response.
 *
 * @param  {String} methodName
 * @param  {Array} validArgumentTypes
 * @param  {RegExp} error
 */
export const validateArguments = (methodName, validArgumentTypes, error = /Match error/) => {
  const validArgumentSets = createPermutationsMatrix(...validArgumentTypes.map((argument) => {
    if (Array.isArray(argument)) {
      return argument.map(arg => ARGUMENT_TYPE_MAP.get(arg));
    }
    return [ARGUMENT_TYPE_MAP.get(argument)];
  }));

  const allArgumentSets = createPermutationsMatrix(...validArgumentTypes.map(() => ARGUMENT_TYPES));
  const invalidArgumentSets = differenceWith(allArgumentSets, validArgumentSets, isEqual);

  invalidArgumentSets.forEach((invalidArgumentSet) => {
    expect(() => Meteor.call(methodName, ...invalidArgumentSet))
    .to.throw(error);
  });

  validArgumentSets.forEach((validArgumentSet) => {
    expect(() => Meteor.call(methodName, ...validArgumentSet))
    .not.to.throw(error);
  });
};
