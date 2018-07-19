import { expect } from 'chai'
import { Meteor } from 'meteor/meteor'
// import Parts from '/imports/api/parts/schema';
import '/imports/api/parts/methods'
import { assert } from 'chai'



describe('database inserting method', () => {
    it('insert 1 part into database', () => {

    })
    console.log(Meteor.server)
    expect(() => Meteor.call(('parts.insert'))).to.throw()
})

