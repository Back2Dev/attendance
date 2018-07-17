/* eslint-disable no-unused-expressions */
// schema.test.js
import SimpleSchema from 'simpl-schema'
import { Mongo } from 'meteor/mongo';
import { expect } from 'chai';
import sinon from 'sinon';

import { resetDatabase } from '/imports/test/util-test';
import { createdAt, updatedAt, mustEqualOneOf, fixCreatedAt } from '/imports/api/schema';


const testSchema = new SimpleSchema({
  name: {
    type: String,
  },
  foo: {
    type: String,
    optional: true,
  },
  bar: {
    type: String,
    optional: true,
  },
  qux: {
    type: String,
    optional: true,
    custom: mustEqualOneOf(['foo', 'bar']),
  },
  createdAt,
  updatedAt,
});

const TestCollection = new Mongo.Collection('testCollection');
TestCollection.attachSchema(testSchema);


describe('api/schema', () => {
  beforeEach(resetDatabase);

  describe('createdAt', () => {
    it('Gets set when you insert a doc', () => {
      const id = TestCollection.insert({
        name: 'foobar',
      });
      const doc = TestCollection.findOne(id);
      expect(doc.name).to.equal('foobar');
      expect(doc.createdAt).to.be.a('date');
    });

    it('Gets set when you upsert a doc', () => {
      const upsert = TestCollection.upsert({
        name: 'not-an-existing-name',
      }, {
          $set: {
            name: 'new-name',
          },
        });
      expect(upsert.insertedId).to.be.ok;
      const doc = TestCollection.findOne(upsert.insertedId);
      expect(doc).to.be.an('object');
      expect(doc.createdAt).to.be.a('date');
    });

    it('Cannot be overridden during insert/upsert', () => {
      const future = new Date();
      future.setYear(3000);

      const id = TestCollection.insert({
        name: 'foobar',
        createdAt: future,
      });
      const doc = TestCollection.findOne(id);
      expect(doc.createdAt.valueOf()).not.to.equal(future.valueOf());

      const upsert = TestCollection.upsert({
        name: 'quxly',
      }, {
          $set: {
            name: 'foobarqux',
            createdAt: future,
          },
        });
      const upsertDoc = TestCollection.findOne(upsert.insertedId);
      expect(upsertDoc.createdAt.valueOf()).not.to.equal(future.valueOf());
    });

    it('Cannot be updated', () => {
      const id = TestCollection.insert({
        name: 'foobar',
      });
      const doc = TestCollection.findOne(id);
      expect(doc.name).to.equal('foobar');

      const future = new Date();
      future.setYear(3000);

      TestCollection.update(id, {
        $set: {
          createdAt: future,
        },
      });

      const updated = TestCollection.findOne(id);
      expect(future.valueOf()).not.to.equal(doc.createdAt.valueOf());
      expect(updated.createdAt.valueOf()).to.equal(doc.createdAt.valueOf());
    });
  });

  describe('updatedAt', () => {
    let clock;

    beforeEach(() => {
      clock = sinon.useFakeTimers();
    });

    afterEach(() => {
      clock.restore();
    });

    it('Cannot be set on insert', () => {
      const id = TestCollection.insert({
        name: 'foobar',
        updatedAt: new Date(),
      });
      const doc = TestCollection.findOne(id);
      expect(doc.updatedAt).not.to.be.ok;
    });

    // disabled because i can't figure out a way to prevent this
    // simpleschema can't distinguish between an upsert creates
    // a new doc and one that modifies an existing doc.
    xit('Cannot be set on upsert if the doc gets inserted', () => {
      const upsert = TestCollection.upsert({
        name: 'not-an-existing-name',
      }, {
          $set: {
            name: 'a-new-name',
            updatedAt: new Date(),
          },
        });
      const doc = TestCollection.findOne(upsert.insertedId);
      expect(doc.updatedAt).not.to.be.ok;
    });

    it('Sets itself on update', () => {
      const id = TestCollection.insert({
        name: 'foobar',
      });
      const future = new Date();
      future.setYear(3000);
      TestCollection.update(id, {
        $set: {
          name: 'quxly',
          updatedAt: future,
        },
      });
      const updated = TestCollection.findOne(id);
      expect(updated.name).to.equal('quxly');
      expect(updated.updatedAt).to.be.a('date');
      expect(updated.updatedAt.valueOf()).not.to.equal(future.valueOf());
    });

    it('Sets itself on upsert', () => {
      const id = TestCollection.insert({
        name: 'foobar',
      });
      const future = new Date();
      future.setYear(3000);
      TestCollection.upsert({
        name: 'foobar',
      }, {
          $set: {
            name: 'quxly',
            updatedAt: future,
          },
        }, {
          multi: true,
        });


      const numDocs = TestCollection.find().count();
      expect(numDocs).to.equal(1);

      const updated = TestCollection.findOne(id);
      expect(updated.name).to.equal('quxly');
      expect(updated.updatedAt).to.be.a('date');
      expect(updated.updatedAt.valueOf()).not.to.equal(future.valueOf());
    });
  });

  describe('mustEqualOneOf()', () => {
    it('throws if the value isn\'t one of the specified values', () => {
      expect(() => {
        TestCollection.insert({
          name: 'name',
          foo: '1',
          bar: '2',
          qux: '3',
        });
      }).to.throw();
    });

    it('does not throw if the value is equal', () => {
      expect(TestCollection.insert({
        name: 'name',
        foo: '1',
        bar: '2',
        qux: '2',
      })).to.be.ok;
    });

    it('Does not clobber the Type validation/transformation', () => {
      const id = TestCollection.insert({
        name: 'name',
        foo: true,
        bar: false,
        qux: true,
      });
      expect(TestCollection.findOne(id).qux).to.equal('true');
    });
  });

  describe('fixCreatedAt()', () => {
    it('fixes missing createdAt,updatedAt and converts numbers to dates', () => {
      // 2 fixes - both missing
      TestCollection.insert({
        name: 'test missing stuff',
      }, { bypassCollection2: true });
      let numFixed = fixCreatedAt(TestCollection);
      expect(numFixed).to.be.equal(2);

      // 2 fixes - converts createdAt, adds updatedAt
      TestCollection.insert({
        name: 'test number conversion',
        createdAt: 1481715317425,
      }, { bypassCollection2: true });
      numFixed = fixCreatedAt(TestCollection);
      expect(numFixed).to.be.equal(2);

      // 1 fix - convert updatedAt
      TestCollection.insert({
        name: 'test happy day conversion',
        updatedAt: 1481715317425,
        createdAt: new Date(1481715317425),
      }, { bypassCollection2: true });
      numFixed = fixCreatedAt(TestCollection);
      expect(numFixed).to.be.equal(1);
    })
  });
});
