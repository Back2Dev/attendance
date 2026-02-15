import ServerSchema from 'meteor/aldeed:simple-schema'
import {
  OptionalRegExId,
  RegExId,
  OptionalBlackbox,
  OptionalBoolean,
  createdAt,
  updatedAt,
  updatedBy,
  OptionalString,
  OptionalArray,
  OptionalDate,
} from '/imports/api/utils/schema-util'
import CONSTANTS from '/imports/api/constants'

// // A Hack - need to address this properly (for other webforms)
// const doctypes = Object.keys(CONSTANTS.DOCUMENT_TYPES)
// doctypes.push('ex')

const NudgesSchema = new ServerSchema({
  delta: ServerSchema.Integer, // Delta
  deltaUnit: {
    type: String,
    allowedValues: ['hours', 'minutes', 'days', 'weeks', 'months'],
  },
  messageSlug: String,
  sentAt: { type: Date, optional: true },
  scheduleTime: { type: Date, optional: true },
})

const RemindersSchema = new ServerSchema({
  name: String,
  slug: String,
  nudges: OptionalArray,
  ['nudges.$']: NudgesSchema,
})

const docConfigSchema = new ServerSchema({
  // _id: String,
  doctype: {
    type: String,
    optional: true,
    // As we build more systems, doctypes are no longer drawing from a known set
    //    allowedValues: doctypes,
  },
  name: String,
  slug: { type: String, optional: true },
  action: {
    type: String,
    allowedValues: ['create', 'sign', 'signv2', 'approve', 'webform'],
  },
  status: {
    type: String,
    allowedValues: ['ready', 'complete'],
    defaultValue: 'ready',
  },
  completedAt: {
    type: Date,
    optional: true,
  },
  completedBy: OptionalRegExId,
})

const DependsSchema = new ServerSchema({
  id: String,
  name: String,
})

export const NotesSchema = new ServerSchema({
  _id: OptionalRegExId,
  name: OptionalString,
  description: OptionalString,
  when: {
    type: Date,
    optional: true,
    defaultValue: new Date(),
  },
  who: OptionalRegExId,

  doctype: { type: String, optional: true },

  /** readBy is a key/value object, where the keys are the names of the

person who read the note, and the value is the time/date when 
they first read it. Example:
readBy: {
  "Mike King": "2022-02-12 14:25",
  "Arnie Tsieh": "2022-02-11 12:02",
}
 *  */
  readBy: { type: Array, optional: true, defaultValue: [] },
  'readBy.$': Object,
  'readBy.$.name': String,
  'readBy.$.userId': String,
  'readBy.$.date': {
    type: Date,
    autoValue: function () {
      if (!this.isSet) {
        return new Date()
      }
    },
    optional: true,
  },
})

const ExternalSchema = new ServerSchema({
  id: String,
  name: String,
  done: Boolean,
  optional: Boolean,
})

const KeyDatesSchema = new ServerSchema({
  id: OptionalRegExId,
  date: { type: Date },
  detail: OptionalString,
  notes: OptionalString,
  responsible: OptionalString,
  status: {
    type: String,
    allowedValues: ['pending', 'complete'],
    defaultValue: 'pending',
  },
})

export const StepsNotificationSchema = new ServerSchema({
  number: { type: ServerSchema.Integer, defaultValue: 999 },
  trigger: {
    type: String,
    allowedValues: Object.keys(CONSTANTS.TRIGGERS),
    defaultValue: 'complete',
  },
  text: String, // This is the slug of the MessageTemplate
  subject: OptionalString,
  revision: { type: ServerSchema.Integer, defaultValue: 1, optional: true },
  body: OptionalString, // Text or HTML to be sent
  bodyText: OptionalString, // Email plain text version
  bodyObject: OptionalBlackbox, // Used by slate to store structured message
  url: OptionalString, // For in-app notifications
  recipients: { type: Array, optional: true },
  'recipients.$': {
    type: String,
    // allowedValues: Object.keys(CONSTANTS.NOTIFY_ROLES),
  },
  delay: OptionalString,
  method: { type: String, allowedValues: Object.keys(CONSTANTS.NOTIFICATION_METHODS) },
  from: OptionalString, // Email address, phone number etc
  fromName: OptionalString, // From name (for emails)
  userInfo: { type: Boolean, optional: true },
  // List of (comma separated) doctypes to attach to notification (valid for emails only)
  attach: OptionalString,
  // limit the number of emails to send
  limit: { type: ServerSchema.Integer, defaultValue: 0, optional: true },
})

// Warnings configuration
export const StepWarningsSchema = new ServerSchema({
  responsible: OptionalBoolean, // Warn if someone else is responsible for the step
  action: OptionalBoolean, // Warn if taking an action (eg ready/skip/complete) and ask for reason
  status: OptionalBoolean, // Warn if changing the status (without taking an action)
})

// Steps schema containing template
export const StepsTemplateSchema = new ServerSchema({
  name: { type: String, optional: false },
  slug: String,
  role: {
    type: String,
    optional: false,
    defaultValue: 'WSADM',
    // No longer limiting roles, because they come from the DB
    // allowedValues: Object.keys(CONSTANTS.ROLES),
  },
  /* This is a run time field...
   * it will initially be the human readable version of the role
   * and will get updated once a person is assigned to it
   */
  responsible: { type: String, defaultValue: '' },
  depends: { type: Array, optional: true },
  'depends.$': {
    type: DependsSchema,
  },
  priority: {
    type: Number,
    defaultValue: 5,
    optional: true,
  },
  // The hint is displayed as a tooltip to the user
  hint: { type: String, optional: true },
  // Type of the task, eg upload, approve, notify
  type: {
    type: String,
    optional: false,
    allowedValues: Object.keys(CONSTANTS.STEP_TYPES),
  },
  // Could possibly make this an array - depends if some steps deal with multiple doctypes
  doctype: {
    type: String,
    optional: true,
    // As we build more systems, doctypes are no longer drawing from a known set
    //allowedValues: doctypes,
  },
  // Optionally contains the slug of the survey
  webform: OptionalString,
  singular: { type: Boolean, defaultValue: false, optional: true },
  optional: { type: Boolean, defaultValue: false, optional: true },
  hidden: { type: Boolean, defaultValue: false, optional: true },
  internal: { type: Boolean, defaultValue: false, optional: true },
  milestone: { type: Boolean, defaultValue: false, optional: true },
  external: { type: Array, optional: true },
  'external.$': {
    type: ExternalSchema,
  },
  permissions: OptionalBlackbox,
  notifications: { type: Array, optional: true },
  'notifications.$': {
    // type: Object,
    // blackbox: true,
    type: StepsNotificationSchema,
  },
  description: { type: String, optional: true },
  // This is the text that the customer will see to explain what the step is
  customerText: {
    label: 'Step heading (for customer)',
    type: String,
    // This autoValue will pick up the step name as a reasonable starting point. Easier than a migration script :)
    autoValue: function () {
      return this.isSet ? this.value : this.siblingField('name')?.value
    },
  },
  logic: { type: String, optional: true },
  config: OptionalBlackbox,
  docConfig: { type: Array, optional: true },
  'docConfig.$': { type: docConfigSchema },
  // Instructions are displayed when you are about to do the step
  instructions: { type: String, optional: true },
  // Explanation text is used to explain what the step is about
  explanation: { type: String, optional: true },
  attention: {
    // Something needs attention in this step - like it's invalid or inconsistent
    type: Boolean,
    optional: true,
  },
  reminderPlans: OptionalArray,
  'reminderPlans.$': { type: RemindersSchema },
  warn: {
    type: StepWarningsSchema,
    optional: true,
    defaultValue: {
      responsible: false,
      action: false,
      status: false,
    },
  },
})

// Tasks schema containing data (a copy of the step initially)
export let TasksSchema = new ServerSchema({
  _id: OptionalRegExId,
  jobId: OptionalRegExId,
  stageId: OptionalRegExId,
  dueDate: { type: Date, optional: true },
  status: {
    type: String,
    allowedValues: Object.keys(CONSTANTS.STEP_STATUS),
    defaultValue: 'blocked',
  },
  // Note if the task was skipped
  notes: { type: Array, optional: true },
  'notes.$': NotesSchema,
  // This is the userId of the person with PRIMARY responsibility
  // for the task (even though other people may be able to do it)
  assignedTo: OptionalRegExId, // I can't find code which is responsible for this one (Minh)
  completedBy: OptionalString, // Can be 'Unknown' for server tasks
  readyAt: { type: Date, optional: true },
  completedAt: { type: Date, optional: true },
  sortOrder: { type: Number, optional: true },
  cmsUpdatedAt: OptionalDate,
  cmsStatus: OptionalString,
  createdAt,
  updatedAt,
})
TasksSchema = TasksSchema.extend(StepsTemplateSchema)

// This schema is used when upgrading tasks with a new workflow definition
// Remove the dynamic fields
export const TasksDiffSchema = [
  'responsible',
  'config',
  'docConfig',
  'hidden',
  'updatedAt',
].reduce((acc, field) => {
  return acc.omit(field)
}, new ServerSchema(StepsTemplateSchema))

// This schema is used when cloning tasks, to remove the unwanted fields
const omitThese = [
  '_id',
  'status',
  'notes',
  'completedBy',
  'readyAt',
  'completedAt',
  'cmsUpdatedAt',
  'cmsStatus',
  'hidden',
  'assignedTo',
  'createdAt',
  'updatedAt',
]
export const CloneTasksSchema = omitThese.reduce((acc, field) => {
  return acc.omit(field)
}, new ServerSchema(TasksSchema))

//-----------------------------------------

export const ListsTemplateSchema = new ServerSchema({
  name: String,
  // description: String,
  slugs: Array,
  'slugs.$': String,
})

// Overviews are
export const OverviewsTemplateSchema = new ServerSchema({
  // Name used in display
  name: { type: String },
  // description: { type: String, label: 'Description of the group' },
  // NB only 2 lanes, customer and conveyancer (not the same as a role)
  // swimlane: {
  //   type: String,
  //   allowedValues: ['customer', 'conveyancer'],
  //   defaultValue: 'conveyancer',
  // },
  lists: { type: Array, defaultValue: [] },
  'lists.$': ListsTemplateSchema,
  // Array of step slugs
  // Calculated counters for convenience
  total: {
    type: ServerSchema.Integer,
    defaultValue: 0,
    label: 'Total number of steps in this group',
  },
  progress: {
    type: ServerSchema.Integer,
    defaultValue: 0,
    label: 'Percentage progress (0-100)',
  },
  complete: {
    type: ServerSchema.Integer,
    defaultValue: 0,
    label: 'Number of steps in this group that are completed',
  },
  status: {
    type: String,
    allowedValues: ['ready', 'progress', 'complete'],
    defaultValue: 'ready',
  },
})

// Stages schema containing template
export const StagesTemplateSchema = new ServerSchema({
  name: String,
  slug: String,
  steps: { type: Array, optional: true },
  'steps.$': {
    type: StepsTemplateSchema,
  },
  attention: {
    // Something needs attention in this stage
    type: Boolean,
    optional: true,
  },
})

// stages schema containing data
export let StagesSchema = new ServerSchema({
  _id: OptionalRegExId,
  jobId: OptionalRegExId,
  sortOrder: { type: ServerSchema.Integer, optional: true },
  createdAt,
  updatedAt,
})
StagesSchema = StagesSchema.extend(StagesTemplateSchema).omit('steps')

//-----------------------------------------

// Workflow schema containing templates
export const WorkflowsSchema = new ServerSchema({
  _id: OptionalRegExId,
  version: ServerSchema.Integer,
  name: String,
  jobType: { type: String, defaultValue: 'participant' }, // AKA Collection name
  slug: String,
  project: OptionalString,
  stages: {
    type: Array,
    label: 'Array of stages in the workflow',
    optional: true,
  },
  'stages.$': {
    type: StagesTemplateSchema,
  },
  autoActivate: { type: Boolean, defaultValue: false, optional: true },
  overview: { type: OverviewsTemplateSchema, optional: true },
  createdAt,
  updatedAt,
  updatedBy,
})

//-------------------------------------------------

export const WatchersSchema = new ServerSchema({
  role: String,
  userId: RegExId,
  methods: Array,
  'methods.$': { type: String, allowedValues: ['email', 'sms', 'api'] },
})

const SignatureSchema = new ServerSchema({
  userId: OptionalRegExId,
  name: String,
  configs: { type: Array, optional: true },
  'configs.$': OptionalBlackbox,
  signature_url: { type: String, optional: true },
  date_signed: { type: Date, optional: true },
  signer_role: String,
})

/**
 * Fields to be rendered into the PDF
 */
const FieldsSchema = new ServerSchema({
  complete: { type: Boolean, defaultValue: false },
  completedAt: { type: Date, optional: true },
  height: { type: Number },
  name: { type: String },
  page: { type: Number },
  role: { type: String, optional: true },
  textSize: { type: Number, defaultValue: 12 },
  type: {
    type: String,
    allowedValues: ['date', 'name', 'initials', 'text', 'signature'],
  },
  updatedAt: { type: Date, optional: true }, // This is for when the field was updated, rather than the job
  userId: OptionalRegExId,
  width: { type: Number },
  x: { type: Number },
  y: { type: Number },
})

/*
 * Docs don't exist as a collection of their own, but I can see a case when it is relevant,
 * particularly when searching for documents
 */
const DocsSchema = new ServerSchema({
  stage: OptionalString,
  step: OptionalString,
  notes: { type: Array, optional: true },
  'notes.$': NotesSchema,
  type: OptionalString, // This is the same as the slug of the survey
  otherType: OptionalString, // Document type if the type is 'other'
  surveyId: OptionalRegExId, // The id of the survey completed
  formData: {
    // The form data. Deliberately `blackbox`.
    // TODO formalise this structure (worth doing)
    type: Object,
    blackbox: true,
    optional: true,
  },

  formList: {
    // The form data processed. Deliberately `blackbox`.
    type: Array,
    optional: true,
  },
  'formList.$': { type: Object, blackbox: true },
  formStatus: {
    type: String,
    allowedValues: ['ready', 'progress', 'complete', 'cancelled'],
    optional: true,
  },
  fields: {
    type: Array,
    optional: true,
  },
  'fields.$': { type: FieldsSchema },
  externalId: OptionalString,
  docName: OptionalString,
  url: OptionalString,
  old_url: OptionalString,
  thumbnail: OptionalString,
  source: OptionalString, // Where the document came from, eg remote system, upload, generated
  // From document
  status: {
    type: String,
    allowedValues: Object.keys(CONSTANTS.DOC_STATUS_DISPLAY),
    defaultValue: 'draft',
  },
  original_id: {
    type: ServerSchema.Integer,
    label: 'Original id of listing_document, listing_status, form etc',
    optional: true,
  },
  signatures: { type: Array, optional: true },
  'signatures.$': SignatureSchema,
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * */
  // Deprecating this array
  taskIds: { type: Array, optional: true },
  'taskIds.$': RegExId,
  // In favour of a singular reference
  taskId: OptionalRegExId,
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * */
  who: OptionalRegExId, // Who completed it
  assignedTo: OptionalRegExId, // Who should be doing it
  responsible: OptionalString, // Name of person responsible (ie who it's assigned to)
  // When it was completed? Or when
  when: {
    type: Date,
    optional: true,
  },
  progress: { type: ServerSchema.Integer, optional: true },
  // May not need this
  // populated: { type: Boolean, defaultValue: false },
})

//
// People involved with this  workflow
//
export const PersonsSchema = new ServerSchema({
  userId: OptionalRegExId,
  name: String,
  nickname: OptionalString,
  mobile: OptionalString,
  email: OptionalString,
  avatar: OptionalString,
  role: String,
  primary: { type: Boolean, optional: true },
  status: {
    type: String,
    allowedValues: CONSTANTS.PERSON_STATUS,
    defaultValue: CONSTANTS.PERSON_STATUS_DEFAULT,
  },
  cstID: { type: Number, optional: true },
})

const CalcStepSchema = new ServerSchema({
  taskId: RegExId,
  name: String,
})

// Jobs contains workflow schema template and data
export let JobsSchema = new ServerSchema({
  _id: OptionalRegExId,
  identifier: OptionalString, // This is the human readable id, eg "SC19 10.14.2023"
  stage: { type: ServerSchema.Integer, defaultValue: 0 },
  persons: { type: Array },
  'persons.$': PersonsSchema,
  lastStep: { type: CalcStepSchema, optional: true },
  nextStep: { type: Array, optional: true },
  'nextStep.$': CalcStepSchema,
  counts: OptionalBlackbox, // Status counts
  roleCounts: OptionalBlackbox, // Status counts by role
  total: { type: ServerSchema.Integer, defaultValue: 0 },
  progress: { type: ServerSchema.Integer, defaultValue: 0 },
  complete: { type: ServerSchema.Integer, defaultValue: 0 },
  status: {
    type: String,
    allowedValues: Object.keys(CONSTANTS.JOB_STATUS),
    defaultValue: 'active',
  },
  approved: { type: Boolean, optional: true },
  docs: { type: Array },
  'docs.$': DocsSchema,
  keyDates: { type: Array, optional: true },
  'keyDates.$': {
    type: KeyDatesSchema,
  },
  notes: { type: Array, optional: true },
  'notes.$': NotesSchema,
})
JobsSchema = JobsSchema.extend(WorkflowsSchema).omit('stages')
