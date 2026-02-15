import { expect } from 'chai'
import { checkAudits } from '/imports/api/audits/functions'
import { resetDatabase } from '/imports/api/cleaner'
import { expectNotToThrowError } from '/imports/test/chai-expect-throw-error'

const debug = require('debug')('app:webform-api-submit-test')

describe('Webform API Submit', function () {
  before(async function () {
    await resetDatabase()
  })
  it('Creates the audit and converts the audit to the correct object using the listing id', async function () {
    // create a WSADM user
    const wsadminUser = await Factory.createAsync('user', {
      username: `wsadmin-${Date.now()}@example.com`,
      roles: ['WSADM'],
    })
    debug('wsadminUser', wsadminUser)

    await Factory.createAsync('audits', {
      event: 'Upload Engagement Letter',
      data: {
        user: wsadminUser.userId,
        // listingId: listing._id,
      },
    })
    const result = await expectNotToThrowError(async () => checkAudits())
    expect(result.status).to.be.equal('success')
  })
})
