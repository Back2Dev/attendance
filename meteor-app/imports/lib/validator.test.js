import { validateArguments } from '/imports/test/util';
import { resetDatabase } from '/imports/test/util-test';

import '/imports/lib/validator';


describe('lib/validator', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('validateCollection() meteor method', () => {
    it('validates arguments', () => {
      validateArguments('validateCollection', [String]);
    }).timeout(5000);
  });
});
