/**
 * test/util.test.js
 * test the test utilities!
 */
import { expect } from 'chai';
import { check, Match } from 'meteor/check';

import { createPermutationsMatrix, validateArguments } from './util';

describe('/imports/test/util', () => {
  describe('createPermutationsMatrix', () => {
    it('creates a matrix of permutations from 1 or more arrays', () => {
      expect(createPermutationsMatrix([1, 2, 3])).to.deep.equal([
        [1],
        [2],
        [3],
      ]);

      expect(createPermutationsMatrix([1, 2, 3], [4, 5, 6])).to.deep.equal([
        [1, 4],
        [1, 5],
        [1, 6],
        [2, 4],
        [2, 5],
        [2, 6],
        [3, 4],
        [3, 5],
        [3, 6],
      ]);

      expect(createPermutationsMatrix([1, 2, 3], [4, 5, 6], [7, 8, 9])).to.deep.equal([
        [1, 4, 7],
        [1, 4, 8],
        [1, 4, 9],
        [1, 5, 7],
        [1, 5, 8],
        [1, 5, 9],
        [1, 6, 7],
        [1, 6, 8],
        [1, 6, 9],
        [2, 4, 7],
        [2, 4, 8],
        [2, 4, 9],
        [2, 5, 7],
        [2, 5, 8],
        [2, 5, 9],
        [2, 6, 7],
        [2, 6, 8],
        [2, 6, 9],
        [3, 4, 7],
        [3, 4, 8],
        [3, 4, 9],
        [3, 5, 7],
        [3, 5, 8],
        [3, 5, 9],
        [3, 6, 7],
        [3, 6, 8],
        [3, 6, 9],
      ]);
    });
  });

  describe('validateArguments()', () => {
    before(() => {
      // create a Meteor method that uses check() to accept two arguments;
      // a String and an optional Object.
      Meteor.methods({
        validateArgumentsTestMethod(firstArgument, secondArgument) {
          check(firstArgument, String);
          check(secondArgument, Match.Optional(Object));

          // if you make it this far, we'll throw a different error;
          // because most methods will if you don't give them actually useful
          // arguments or if you're not testing as a real user, etc.
          throw new Error('A different error');
        },
      });
    });

    it('Validates that a Meteor method is type-checking arguments', () => {
      expect(() => validateArguments('validateArgumentsTestMethod'))
      .to.throw();
      expect(() => validateArguments('validateArgumentsTestMethod', [String, Object]))
      .to.throw();
      expect(() => validateArguments('validateArgumentsTestMethod', [String, [undefined, Object]]))
      .not.to.throw();
    });
  });
});
