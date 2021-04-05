import { Meteor } from 'meteor/meteor'
import sinon from 'sinon'

/**
 * Stub Meteor.user() during the calling of a Meteor method
 * @param  {Object}    user
 * @param  {String}    method
 */
export const callStubbed = (user, method, ...args) => {
  if (!user && user !== null) throw new Error('stubUserCall requires object or null')

  const userStub = sinon.stub(Meteor, 'user')
  userStub.returns(user)
  const userIdStub = sinon.stub(Meteor, 'userId')
  userIdStub.returns(user._id)

  try {
    const result = Meteor.call(method, ...args)
    userStub.restore()
    userIdStub.restore()
    return result
  } catch (err) {
    userStub.restore()
    userIdStub.restore()
    throw err
  }
}
