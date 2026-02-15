import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import logger from '/imports/lib/log';
import { canDo } from '/imports/api/utils/access-control';
import { getMyRoles, hasRole } from '/imports/api/users/utils';
import { RoleType } from '/imports/types/resources';
import { Jobs, Tasks } from '/imports/api/workflows/schema';

const debug = require('debug')('app:workflows-utils');

type Action = 'update' | 'delete' | 'create' | 'read';

interface TaskPermissionProps {
  id: string;
  jobId?: string;
}

export type NameDetailsType = {
  first_name: string;
  middle_name?: string;
  last_name?: string;
};

export const authenticationCheck = async () => {
  //Authentication
  if (!(await Meteor.userAsync())) {
    debug('authenticationCheck fail');
    throw new Meteor.Error('Permission denied - not logged in');
  }
};

export const checkTaskPermission = async (
  { id: taskId, jobId }: TaskPermissionProps,
  action: Action
) => {
  await authenticationCheck();

  const task = await Tasks.findOneAsync(taskId);
  const job = await Jobs.findOneAsync(jobId || task.jobId);
  debug('checkTaskPermission()', jobId);
  if (jobId && job.jobId !== jobId)
    throw new Meteor.Error('Permission denied (denied-job)');
  const myRoles = (await getMyRoles()) as RoleType[];
  // debug('can do any', canDo({ op: `${action}Any`, role: myRoles, resource: 'task' }));
  //Autheriazation
  if (!canDo({ op: `${action}Any`, role: myRoles, resource: 'task' })) {
    if (canDo({ op: `${action}Own`, role: myRoles, resource: 'task' })) {
      // check if user is in the job persons
      // console.log(job.persons);
      if (!job.persons.some((p) => p.userId === Meteor.userId())) {
        throw new Meteor.Error('Permission denied (2t)');
      }
    } else {
      throw new Meteor.Error('Permission denied');
    }
  }
  debug({ action, myRoles });
};

export const checkJobPermission = async (
  { id: jobId }: TaskPermissionProps,
  action: Action
) => {
  await authenticationCheck();
  const myRoles = (await getMyRoles()) as RoleType[];
  //Authorization
  if (!canDo({ op: `${action}Any`, role: myRoles, resource: 'job' })) {
    if (canDo({ op: `${action}Any`, role: myRoles, resource: 'job' })) {
      const job = await Jobs.findOneAsync(jobId);
      if (!job?.persons?.some((p) => p.userId === Meteor.userId())) {
        throw new Meteor.Error('Permission denied (2j)');
      }
    } else {
      throw new Meteor.Error('Permission denied');
    }
  }
};

export const checkWorkflowPermission = async () => {
  await authenticationCheck();
  //Autheriazation
  if (!(await hasRole(await Meteor.userAsync(), 'ADM'))) {
    throw new Meteor.Error('Permission denied');
  }
};

export const getImage = (job) => {
  return job?.docs?.find((doc) => doc.type === 'image');
};

export const getPerson = (job, userId) => {
  if (!job) {
    return null;
  }
  const person = job?.persons?.find((person) => person.userId === userId);
  return person || null;
};

export const checkUpdateJobPermission = async (job) => {
  const myRoles = await getMyRoles();
  if (canDo({ op: 'updateOwn', role: myRoles, resource: 'job' })) {
    // check if user is in the job persons
    if (job?.persons?.some((p) => p.userId === Meteor.userId())) {
      // debug({ persons: job.persons })
      return;
    }
  }

  if (canDo({ op: 'updateAny', role: myRoles, resource: 'job' })) {
    return;
  }

  logger.info('canNotDo: checkUpdateJobPermission', {
    role: myRoles,
    resource: 'job',
  });

  throw new Meteor.Error('Permission denied');
};

export const checkUpdateAnyJobPermission = async () => {
  const myRoles = await getMyRoles();
  if (
    !canDo({
      op: 'updateAny',
      role: myRoles,
      resource: 'job',
      log: 'checkUpdateAnyJobPermission',
    })
  ) {
    throw new Meteor.Error('Permission denied');
  }
};

export const checkUpdateOwnJobPermission = async (job) => {
  const myRoles = await getMyRoles();

  if (canDo({ op: 'updateAny', role: myRoles, resource: 'job' })) {
    return;
  }

  if (canDo({ op: 'updateOwn', role: myRoles, resource: 'job' })) {
    // check if user is in the job persons
    if (job?.persons?.some((p) => p.userId === Meteor.userId())) {
      return;
    }
  }

  throw new Meteor.Error('Permission denied');
};

export const checkReadJobPermission = async (job) => {
  const myRoles = await getMyRoles();
  if (canDo({ op: 'readAny', role: myRoles, resource: 'job' })) {
    return;
  }

  if (canDo({ op: 'readOwn', role: myRoles, resource: 'job' })) {
    // check if user is in the job persons
    if (job?.persons?.some((p) => p.userId === Meteor.userId())) {
      return;
    }
  }

  logger.info('canNotDo: checkReadJobPermission', {
    role: myRoles,
    resource: 'job',
  });

  throw new Meteor.Error('Permission denied');
};

export const checkReadAnyJobPermission = async () => {
  const myRoles = await getMyRoles();
  if (
    !canDo({
      op: 'readAny',
      role: myRoles,
      resource: 'job',
      log: 'checkReadAnyJobPermission',
    })
  ) {
    throw new Meteor.Error('Permission denied');
  }
};

export const getTaskByJobIdAndTaskId = async ({ jobId, taskId }) => {
  const job = await Jobs.findOneAsync({ jobId });
  if (!job) {
    throw new Meteor.Error('Job was not found');
  }
  const task = await Tasks.findOneAsync({ _id: taskId, jobId: job._id });
  if (!task) {
    throw new Meteor.Error('Task was not found');
  }
  return { job, task };
};

export const getJobAddress = (job) => {
  if (job?.jobType === 'participant') {
    return job.workshop?.address;
  }
  if (job?.jobType === 'workshop') {
    return job.address;
  }
  return;
};

export const updateJobUserByRole = async ({ id, user }) => {
  try {
    const { userId, role, name, nickname, mobile, email } = user;
    if (!role) throw new Error('No role found in user data');
    const job = await Jobs.findOneAsync(id);
    if (!job) throw new Error(`Could not find job with id ${id}`);

    // check if there is existing role in list of persons
    const existing = job.persons?.some((p) => p.role === role);
    if (existing) {
      let n = await Jobs.updateAsync(
        { _id: id, 'persons.role': `${role}` },
        {
          $set: {
            'persons.$.name': name,
            'persons.$.userId': userId,
            'persons.$.mobile': mobile || '',
            'persons.$.email': email,
            'persons.$.nickname': nickname || name,
            'persons.$.status': 'active',
          },
        }
      );

      const roleReg = new RegExp(`^${role}`);
      const docs = job.docs;
      let changed;
      docs.forEach((doc) => {
        doc.signatures
          ?.filter((sig) => sig.signer_role.match(roleReg))
          .forEach((sig) => {
            sig.userId = userId;
            sig.name = name;
            changed = true;
          });
      });
      if (changed)
        n =
          n +
          (await Jobs.updateAsync(
            { _id: id },
            {
              $set: { docs },
            }
          ));

      if (!n) throw new Error('Database update error');
    } else {
      const m = await Jobs.updateAsync(
        { _id: id },
        {
          $push: {
            persons: {
              name,
              userId,
              mobile: mobile || '',
              email,
              nickname: nickname || name,
              role,
              status: 'active',
            },
          },
        }
      );

      if (!m) throw new Error('Database update error 2');
    }

    logger.audit(`Updated a user on job ${id}`, { jobId: id, user });
    return { status: 'success', message: `Updated user on job ${id}` };
  } catch (e) {
    return {
      status: 'failed',
      message: `Error when updating user on job: ${e.message}`,
    };
  }
};

export const replacePersonOnJob = async ({ id, user, role }) => {
  try {
    check(id, String);
    check(user, Object);
    check(role, String);

    const { userId, name, mobile, email, nickname } = user;

    const job = await Jobs.findOneAsync({ _id: id });
    if (!job) throw new Error(`Could not find job with id ${id}`);

    // check if there is existing role in list of persons
    const existing = job.persons?.some((p) => p.role === role);
    if (existing) {
      const n = await Jobs.updateAsync(
        { _id: id, 'persons.role': role },
        {
          $set: {
            'persons.$.name': name,
            'persons.$.userId': userId,
            'persons.$.mobile': mobile || '',
            'persons.$.email': email,
            'persons.$.nickname': nickname,
            'persons.$.status': 'active',
          },
        }
      );

      if (n === 0) throw new Error('Could not update job');
    } else {
      const n = await Jobs.updateAsync(
        { _id: id },
        {
          $push: {
            role,
            name,
            userId,
            mobile: mobile || '',
            email,
            nickname,
            status: 'active',
          },
        }
      );

      if (n === 0) throw new Error('Could not update job');
    }

    return { status: 'success', message: 'Successfully replaced user in job' };
  } catch (e) {
    logger.warn(`Error when replacing person in job: ${e.message}`);
    return {
      status: 'failed',
      message: `failed to replace person in job due to Error: ${e.message}`,
    };
  }
};
