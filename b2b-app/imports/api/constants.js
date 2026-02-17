// constants.js
//
// This file contains constants to be used within the app
//

const CONSTANTS = {}

CONSTANTS.ROLES = {
  ADM: 'Admin',
  SYS: 'System',
  MEM: 'Member',
  COA: 'Coach',
  GRE: 'Greeter',
  MEC: 'Mechanic',
}

// Notificaton roles adds a 'USR' role, for the current user
CONSTANTS.NOTIFY_ROLES = Object.assign({}, CONSTANTS.ROLES)
CONSTANTS.NOTIFY_ROLES.USR = 'Current user'
CONSTANTS.ADM_JOB_ROLES = { ...CONSTANTS.ROLES }

CONSTANTS.JOB_ROLES = {}

CONSTANTS.WS_ROLES = { ...CONSTANTS.ROLES }

// We can remove these roles from a job
CONSTANTS.REMOVABLE_ROLES = ['BOSS', 'PEER', 'KOI', 'EXEC', 'WSLEAD']

// When removing a role, For these roles, set task status to 'removed'
CONSTANTS.DONT_DELETE_ROLES = ['BOSS', 'PEER', 'KOI']

// These roles are one per job, so adding means replacing
CONSTANTS.REPLACEABLE_ROLES = ['EXEC', 'WSADM']

// We can set these roles back to 'Unassigned'
CONSTANTS.CAN_UNASSIGN_ROLES = ['EXEC', 'WSLEAD']

CONSTANTS.USER_SWITCHABLE_ROLES = [
  'ADM',
  'PART',
  'BOSS',
  'EXEC',
  'WSADM',
  'WSLEAD',
  // 'PEER',
  // 'KOI',
]

CONSTANTS.NOTIFICATION_METHODS = {
  APP: 'Application',
  EMAIL: 'Email',
  SMS: 'SMS',
  API: 'API',
}

CONSTANTS.DAYS_WEEK = [
  { id: 0, value: 'Su' },
  { id: 1, value: 'Mo' },
  { id: 2, value: 'Tu' },
  { id: 3, value: 'We' },
  { id: 4, value: 'Th' },
  { id: 5, value: 'Fr' },
  { id: 6, value: 'Sa' },
]

CONSTANTS.TRIGGERS = {
  create: 'Create',
  ready: 'Ready',
  open: 'Open',
  complete: 'Complete',
  cancel: 'Cancel',
  reject: 'Reject',
  reopen: 'Re-open',
  skip: 'Skip',
  skipall: 'Skip all',
}
CONSTANTS.DOCUMENT_ACTIONS = {
  keep: 'Keep document',
  rmDoc: 'Remove document',
  reopen: 'Reopen',
  block: 'Block',
}

CONSTANTS.USER_STATUS = {
  active: 'Active',
  suspended: 'Suspended',
  pending: 'Pending',
  deleted: 'Deleted',
}

CONSTANTS.AUDIT_STATUS = {
  created: 'Created',
  logged: 'Logged',
  failed: 'Failed',
}
CONSTANTS.USER_STATUS_COLORS = {
  active: '#31a750',
  suspended: '#000',
  pending: '#fcaf47',
  deleted: '#ea4435',
}

CONSTANTS.DEFAULT_AVATAR = '/images/default-avatar.png'

// Use this message if no event was specified - it emails ADM, so that we get to know about it
CONSTANTS.UNKNOWN_EVENT = 'unknown-event'

CONSTANTS.EVENT_STATUS = {
  active: 'Active',
  cancelled: 'Cancelled',
  deleted: 'Deleted',
}

// These are human readable values, for display purposes
CONSTANTS.DOC_STATUS_DISPLAY = {
  draft: 'Draft',
  approved: 'Approved',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
  requested: 'Requested',
}
// These are values to use in the DB
CONSTANTS.DOC_STATUS = Object.keys(CONSTANTS.DOC_STATUS_DISPLAY)

CONSTANTS.JOB_STATUS = {
  active: 'Active',
  hold: 'Hold',
  cancel: 'Cancelled',
  complete: 'Complete',
}

CONSTANTS.FORM_STATUS = {
  ready: 'Ready',
  progress: 'In progress',
  complete: 'Complete',
  cancelled: 'Cancelled',
}

// Product Type values
CONSTANTS.PRODUCT_TYPES = {
  PASS: 'pass',
  COURSE: 'course',
  MEMBERSHIP: 'membership',
  MERCHANDISE: 'merchandise',
  HIRE: 'hire',
}
// Human readable lookup table:
CONSTANTS.PRODUCT_TYPES_READABLE = {
  pass: 'Pass',
  course: 'Course',
  membership: 'Membership',
  merchandise: 'Merchandise',
  hire: 'Hire',
}
CONSTANTS.STEP_TYPES = {
  assign: 'Assign',
  upload: 'Upload',
  approve: 'Approve (v1)',
  approvev2: 'Approve (v2)',
  notification: 'Notify',
  webform: 'Webform',
  header: 'Header',
  nextstage: 'Next stage',
  sign: 'Sign (v1)',
  signv2: 'Sign (v2)',
  external: 'External',
  bot: 'Robot',
  ['set-date-time']: 'Date/time',
  question: 'question',
  prep: 'Prepare for signing (v1)',
  prepv2: 'Prepare for signing (v2)',
  multi: 'Multi-step',
  'edit-workshop': 'Edit-Workshop',
}


CONSTANTS.CART_STATUS = {
  READY: 'ready',
  DENIED: 'denied',
  CANCELLED: 'cancelled',
  COMPLETE: 'complete',
  ENUM: ['ready', 'denied', 'cancelled', 'complete'],
}


CONSTANTS.STEP_STATUS = {
  blocked: 'Pending',
  skipped: 'Skipped',
  ready: 'Ready',
  rejected: 'Rejected',
  failed: 'Failed',
  complete: 'Complete',
  removed: 'Removed',
  hidden: 'Hidden',
}

// Consider to move these badges to a database collection
// We may have a badge for every event? or monthly badge?
CONSTANTS.BADGES = [
  {
    code: 'card',
    title: 'Credit card',
    icon: '/badges/card.png',
    url: '/support',
    private: true,
  },
  {
    code: 'cup',
    title: 'You won a cup',
    icon: '/badges/cup.jpg',
  },
  {
    code: 'facebook',
    title: 'Linked facebook profile',
    icon: '/badges/facebook.jpg',
  },
  {
    code: 'flag',
    title: 'Has some flags?',
    icon: '/badges/flag.png',
  },
  {
    code: 'google',
    title: 'Linked google email',
    icon: '/badges/google.jpg',
  },
  {
    code: 'star',
    title: 'Must be very famous?',
    icon: '/badges/star.png',
  },
  { code: 'twins', title: 'Twin tanks', icon: '/badges/twins.jpg' },
  { code: 'rescue', title: 'Rescue diver', icon: '/badges/rescue.jpg' },
]

CONSTANTS.JOB_STATUS_READABLE = {
  new: 'New',
  'in-progress': 'In Progress',
  'quality-check': 'Quality Check',
  ready: 'Ready for Pick Up',
  // 'picked-up': 'Picked Up',
  cancelled: 'Cancelled',
  completed: 'Completed',
}

CONSTANTS.JOB_STATUS_MAPPING = {
  new: [{ next: 'in-progress', label: 'Start' }],
  'in-progress': [
    { next: 'new', label: 'New' },
    { next: 'quality-check', label: 'Quality Check' },
  ],
  'quality-check': [
    { next: 'in-progress', label: 'In Progress' },
    { next: 'ready', label: 'Ready' },
  ],
  ready: [
    // { next: 'picked-up', label: 'Picked Up' },
    { next: 'quality-check', label: 'Check again' },
    { next: 'completed', label: 'Complete' },
  ],
  // 'picked-up': [],
  cancelled: [{ next: 'in-progress', label: 'Re-open' }],
  completed: [{ next: 'in-progress', label: 'Re-open' }],
}

CONSTANTS.SERVICE_TYPES = {
  minor: 'Minor service',
  major: 'Major service',
  custom: 'Custom service',
}

CONSTANTS.UPLOAD_ACCEPT_FILES = {
  'image/*': ['.heic', '.png', '.jpg', '.jpeg', '.gif', '.webp'],
  'application/pdf': ['.pdf'],
  'application/txt': ['.txt'],
  'text/plain': ['.txt', '.text'],
  'text/csv': ['.csv'],
  'text/tsv': ['.txt', '.tsv'],
  'text/rtf': ['.rtf'],
  'application/rtf': ['.rtf'],
  'application/msword': ['.doc', '.rtf'],
  'application/doc': ['.doc', '.docx', '.rtf'],
  'application/xls': ['.xls', '.xlsx'],
  // TODO: Decide if zip files are supported
  // 'application/zip': ['.zip'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': [
    '.ppt',
    '.pptx',
  ],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
    '.doc',
    '.docx',
  ],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
}
export default CONSTANTS
