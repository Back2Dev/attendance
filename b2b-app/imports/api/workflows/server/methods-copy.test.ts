import { expect } from 'chai';
import './methods-copy';
import { expectToThrowError } from '/imports/test/chai-expect-throw-error';
import Factory from '/imports/test/factories';
import { callAsyncStubbed } from '/imports/test/util';

const debug = require('debug')('app:workflows:methods:test');

describe('jobs.byId method', () => {
  it('should throw an error if user is not logged in', async () => {
    await expectToThrowError(async () => {
      await callAsyncStubbed(null, 'jobs.byId', {
        id: 'someJobId',
      });
    }, 'Permission denied');
  });
  it('should throw an error if user does not have permission', async () => {
    // Simulate a user without the required permissions
    const userId = 'userWithoutPermission';

    await expectToThrowError(async () => {
      await callAsyncStubbed({ _id: userId }, 'jobs.byId', {
        id: 'someJobId',
      });
    });
  });
  it('should throw an error if job is not found', async () => {
    // create a admin user for the test
    const adminUser = await Factory.createAsync('user', { roles: ['ADM'] });

    await expectToThrowError(async () => {
      await callAsyncStubbed(adminUser, 'jobs.byId', {
        id: 'nonExistentJobId',
      });
    }, 'Job not found');
  });
  it('should return job details with all fields', async () => {
    // create a admin user for the test
    const adminUser = await Factory.createAsync('user', { roles: ['ADM'] });

    // create a workshop
    const workshop = await Factory.createAsync('workshops', {});
    debug('created workshop', workshop);

    // create a participant
    const job = await Factory.createAsync('participants', {
      wfSlug: 'regular-participant',
      workshopId: workshop._id,
      workshop: {
        workshopId: workshop._id,
        name: workshop.name,
        location: workshop.location,
        address: workshop.address,
        city: workshop.city,
        state: workshop.state,
        hotel_id: workshop.hotel_id,
        dates: workshop.dates,
        workshopType: workshop.workshopType,
      },
    });

    const result = await callAsyncStubbed(adminUser, 'jobs.byId', {
      id: workshop._id,
      allFields: true,
    });

    debug('result', result);

    expect(result).to.have.property('jobs').which.is.an('array').which.has.lengthOf(2);
    expect(result).to.have.property('stages').which.is.an('array');
    expect(result).to.have.property('tasks').which.is.an('array');
    expect(result).to.have.property('messages').which.is.an('array');
    expect(result).to.have.property('profiles').which.is.an('array');
    expect(result).to.have.property('users').which.is.an('array');
    expect(result).to.have.property('workflows').which.is.an('array');
    expect(result).to.have.property('messageTemplates').which.is.an('array');
    expect(result).to.have.property('surveys').which.is.an('array');
  });
});
