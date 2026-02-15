import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { TaskType } from '/imports/types/task';
import { WorkflowType } from '/imports/types/workflow';
import { JobType } from '/imports/types/job';
import { StageType } from '/imports/types/stage';

export const Tasks = new Mongo.Collection<TaskType>('tasks');

if (Meteor.isServer) {
  const TasksSchema = require('./server/schema-def').TasksSchema;
  Tasks.attachSchema(TasksSchema);
}

//-----------------------------------------

export const Stages = new Mongo.Collection<StageType>('stages');

if (Meteor.isServer) {
  const StagesSchema = require('./server/schema-def').StagesSchema;
  Stages.attachSchema(StagesSchema);
}

//-----------------------------------------

export const Workflows = new Mongo.Collection<WorkflowType>('workflows');

if (Meteor.isServer) {
  const WorkflowsSchema = require('./server/schema-def').WorkflowsSchema;
  Workflows.attachSchema(WorkflowsSchema);
}

//-------------------------------------------------
export const Jobs = new Mongo.Collection<JobType>('jobs');

if (Meteor.isServer) {
  const JobsSchema = require('./server/schema-def').JobsSchema;
  Jobs.attachSchema(JobsSchema); // ?? Need a default selector?
}

export default Workflows;
