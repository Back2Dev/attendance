import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { canDo } from '/imports/api/utils/access-control';
import { getMyRoles } from '/imports/api/users/utils';
import { check } from 'meteor/check';
import Workflows, { Jobs, Stages, Tasks } from '../schema';
import Participants from '/imports/api/participants/schema';
import { TaskType } from '/imports/types/task';
import Messages from '/imports/api/messages/schema';
import Profiles from '/imports/api/profiles/schema';
import MessageTemplates from '/imports/api/message-templates/schema';
import Surveys from '/imports/api/surveys/schema';

export interface JobsByIdMethodParams {
  id: string;
  allStatus?: boolean;
  allFields?: boolean;
  completedBy?: boolean;
}
Meteor.methods({
  // ek-750: we create the method to replace the publication
  async 'jobs.byId'({
    id,
    allStatus = true,
    allFields = true,
    completedBy = false,
  }: JobsByIdMethodParams) {
    check(id, String);
    check(allStatus, Boolean);
    check(allFields, Boolean);
    check(completedBy, Boolean);

    if (!Meteor.userId()) {
      throw new Meteor.Error('Permission denied');
    }

    // check for permissions, the user must be an admin
    const myRoles = await getMyRoles();
    if (
      !canDo({
        op: 'readAny',
        resource: 'job',
        role: myRoles,
      })
    ) {
      throw new Meteor.Error(
        'not-authorized',
        'You do not have permission to access this resource.'
      );
    }

    const job = await Jobs.findOneAsync({ _id: id });
    if (!job) {
      throw new Meteor.Error('not-found', 'Job not found');
    }

    const jobIds = [job._id];
    if (job.jobType === 'workshop') {
      const participants = await Participants.find({
        'workshop.workshopId': job._id,
        jobType: 'participant',
      }).fetchAsync();
      participants.forEach((p) => jobIds.push(p._id));
    }

    let persons = job?.persons?.map((person) => person.userId).filter(Boolean);

    const taskQuery: Mongo.Selector<TaskType> = {
      jobId: { $in: jobIds },
    };
    if (!allStatus) taskQuery.hidden = { $ne: true };

    const tasks = await Tasks.find(taskQuery, {
      // hint: 'by_jobId_status_role',
    }).fetchAsync();

    if (completedBy) {
      // find all userId which is outside the job persons who interacted with this job, e.g: admin overwrite some tasks
      tasks.map((item) => {
        if (item.completedBy && !persons.includes(item.completedBy)) {
          persons.push(item.completedBy);
          // debug('pushed to persons', item.completedBy)
        }
      });
    }

    // Run through all the jobs finding other people...
    const allJobs = Jobs.find({ _id: { $in: jobIds } });
    await allJobs.mapAsync((job) => {
      job.persons.forEach((person) => {
        if (!persons.includes(person.userId)) persons.push(person.userId);
        const q10a = job.docs?.find((doc) => doc.type === 'ekit-q10a');
        if (q10a) {
          const peers = q10a.formData?.q10a?.kp || q10a.formData?.q10a?.personnel;
          if (peers) {
            peers.forEach((kp) => {
              if (!persons.includes(kp.userId)) persons.push(kp.userId);
            });
            q10a.formList?.forEach((kp) => {
              if (kp.hasOwnProperty('userId') && !persons.includes(kp['userId']))
                persons.push(kp['userId']);
            });
          }
        }
        const q5 = job.docs?.find((doc) => doc.type === 'ekit-q5');
        if (q5) {
          const team = q5.formData?.q5?.koi || q5.formData?.q5?.personnel;
          if (team) {
            team.forEach((kp) => {
              if (!persons.includes(kp.userId)) persons.push(kp.userId);
            });
            q5.formList?.forEach((kp) => {
              if (kp.hasOwnProperty('userId') && !persons.includes(kp['userId']))
                persons.push(kp['userId']);
            });
          }
        }
      });
    });

    const profileOptions = allFields
      ? {}
      : { fields: { _id: 1, name: 1, signature: 1, userId: 1, ignorePreview: 1 } };

    const userOptions = allFields
      ? {}
      : {
          fields: {
            username: 1,
            emails: 1,
            createdAt: 1,
          },
        };
    const wfQuery = allFields ? {} : { slug: 'IMPOSSIBLE' }; // Prevent publishing workflow defs

    persons = persons.filter(Boolean);
    const users = await Meteor.users
      .find({ _id: { $in: persons } }, userOptions)
      .fetchAsync();

    return {
      jobs: await Jobs.find({ _id: { $in: jobIds } }).fetchAsync(),
      stages: await Stages.find({ jobId: { $in: jobIds } }).fetchAsync(),
      tasks,
      messages: await Messages.find({
        $or: [
          { jobId: { $in: jobIds } },
          //  { recipientId: { $in: persons } }
        ],
      }).fetchAsync(),
      profiles: await Profiles.find(
        { userId: { $in: persons } },
        profileOptions
      ).fetchAsync(),
      // // TODO: we may remove this later, now the front-end tried to get the user's roles from this collection but we don't store roles in this collection anymore
      users,
      workflows: await Workflows.find(wfQuery, {
        fields: { slug: 1, name: 1 },
      }).fetchAsync(),
      messageTemplates: await MessageTemplates.find({}).fetchAsync(),
      surveys: await Surveys.find({ active: true }).fetchAsync(),
    };
  },
});
