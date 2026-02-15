import ServerSchema from 'meteor/aldeed:simple-schema'
import CONSTANTS from '/imports/api/constants'
import {
  OptionalRegExId,
  OptionalString,
  OptionalBlackbox,
  OptionalBoolean,
  OptionalArray,
  Blackbox,
  createdAt,
  updatedAt,
  updatedBy,
} from '/imports/api/utils/schema-util'

export const SurveyStepsSchema = new ServerSchema({
  name: String,
  id: String,
  validations: { type: Array, optional: true },
  'validations.$': OptionalBlackbox,
  questions: Array,
  'questions.$': Blackbox,
  condition: { type: Array, optional: true },
  'condition.$': String,
  custom: OptionalString, // Used for custom steps (see also custom questions)
})

export const SurveyCoordsSchema = new ServerSchema({
  id: String, // The id of the variable
  page: { type: ServerSchema.Integer, defaultValue: 1, optional: true }, // PDF File page no
  y: { type: ServerSchema.Integer, defaultValue: 0, optional: true }, // X-coordinate on page
  x: { type: ServerSchema.Integer, defaultValue: 0, optional: true }, // Y-coordinate on page
  width: { type: ServerSchema.Integer, defaultValue: 10, optional: true }, // size of image
  height: { type: ServerSchema.Integer, defaultValue: 10, optional: true }, // size of image
  // The 'value' has different meanings:
  // type === 'string' - render the data value itself
  // type === 'checkbox' - if the data value matches this value, render a checkbox
  // type === 'image' - if present, render the image
  value: OptionalString, // The value
  type: {
    type: String,
    allowedValues: ['string', 'checkbox', 'image'],
  },
})

const ConsentSchema = new ServerSchema({
  roles: { type: Array, optional: true },
  'roles.$': { type: String, allowedValues: Object.keys(CONSTANTS.ROLES) },
  instructions: OptionalBlackbox,
})

const SurveyConsentSchema = new ServerSchema({
  preConsent: { type: ConsentSchema, optional: true },
  postConsent: { type: ConsentSchema, optional: true },
})

const ActionsSchema = new ServerSchema({
  preMethod: OptionalString,
  postMethod: OptionalString,
  relatedDocs: OptionalBlackbox,
})

// Notification - see triggers and message-templates for details of the message contents
const NotificationSchema = new ServerSchema({
  trigger: String,
  to: String,
  to_name: OptionalString,
  cc: OptionalString,
  from_email: OptionalString,
  from_name: OptionalString,
})

const SubmitSchema = new ServerSchema({
  fieldSimple: { type: Boolean, defaultValue: false },
  fieldMaps: OptionalBlackbox,
  valueMaps: OptionalBlackbox,
  url: String, // Usually https:// for REST API endpoints, or meteor:// for method calls
  privateKey: OptionalString,
  apiKey: OptionalString,
  // This is the path for the key value pairs
  keyValuePath: OptionalString,
  // What the body looks like
  body: OptionalBlackbox,
  // Some kind of computation function needed for header
  bodyFn: OptionalBlackbox,
  headerFn: OptionalBlackbox,
  headers: { type: Object, blackbox: true, defaultValue: {} },
  urlReplacer: OptionalString, // Used to replace token (eg GUIO in the url)
  successMsg: OptionalString,
  appendFormParam: OptionalString,

  // If this isset, API calls are proxied by the server (preferred, as it avoids CORS issues)
  server: { type: Boolean, defaultValue: true },
})

export const KanBanSchema = new ServerSchema({
  name: String,
  id: String,
  slugs: Array,
  'slugs.$': String,
  tags: Array,
  'tags.$': String,
  title: OptionalString,
  label: OptionalString,
  description: OptionalArray,
  'description.$': String,
  stages: Blackbox,
})

export const SurveysSchema = new ServerSchema({
  _id: OptionalRegExId,
  slug: {
    type: String,
    // autoValue: function () {
    //   const newValue = `${this.field('doctype').value || 'ad-hoc'}-${
    //     this.field('variant').value
    //   }-${this.field('version').value}`
    //   // console.log({ newValue })
    //   return newValue
    // },
  },
  name: {
    type: String,
    optional: true,
  },
  project: OptionalString,
  // Banner to show (optional)
  bannerHTML: OptionalString,

  // Prologue is the verbiage show to the user at the START of the survey
  // It is an object, and has text for each role
  prologue: OptionalString,
  prologueImage: OptionalString,

  // Prologue is the verbiage show to the user at the END of the survey
  // It is an object, and has text for each role
  epilogue: OptionalString,
  epilogueImage: OptionalString,

  // Survey is active and can be used
  active: { type: Boolean, defaultValue: true },

  showPreview: { type: Boolean, defaultValue: false },
  canReturn: OptionalBoolean, // Controls the "Save and return later" button
  canJumpStep: OptionalBoolean, // Allows clicking on stepper
  keepTitle: OptionalBoolean, // Keeps the title of the survey (html page title)

  steps: { type: Array, defaultValue: [] },
  'steps.$': SurveyStepsSchema,

  signatures: OptionalBlackbox,

  // The populate object is a list of field mappings
  //   - basically sources of information and fieldmapping
  populate: OptionalBlackbox,

  // This is for calculations done at submit time
  postcalc: OptionalBlackbox,

  // the pdfFields object is a field map, allowing the
  //   the field names in the PDF to be more human readable
  pdfFields: OptionalBlackbox,

  // Rules for scoring, eg weighting etc
  scoring: OptionalBlackbox,

  // Survey doctype, variant and version, used to create the slug, eg `${doctype}-${variant}-${version}`
  doctype: {
    type: String,
    defaultValue: 'ad-hoc',
  },
  variant: {
    type: String,
    defaultValue: 'a',
  },
  version: {
    type: String,
    defaultValue: 'v1',
  },
  versionLabel: {
    type: String,
    optional: true,
  },

  completeMessage: OptionalString,
  //
  // Consent can be asked for before or after
  //
  consent: { type: SurveyConsentSchema, optional: true },

  //
  // Sometimes we need to collect additional documents,
  // eg if you say yes to "Drivers license?", then it's reasonable
  // for you to upload it afterwards
  ['after-docs']: OptionalBlackbox,

  // Actions are Meteor method names that can be called
  // before, after, or to build related documents from the data
  actions: { type: ActionsSchema, optional: true },

  // If this is present, we will need to
  // submit the form data to a REST API.
  // The object will contain information such as body format,
  // url, field mapping etc
  submit: { type: SubmitSchema, optional: true },
  notification: { type: NotificationSchema, optional: true },
  kanban: { type: KanBanSchema, optional: true },
  // Goes to this URL when finished:
  returnUrl: OptionalString,
  source: OptionalString, // The original text source
  listMap: OptionalBlackbox, // Mapping for list view
  custom: OptionalString,
  createdAt,
  updatedAt,
  updatedBy,
})
